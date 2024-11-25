'use server'

import axios from 'axios'
import { GoogleGenerativeAI } from '@google/generative-ai'

const GOOGLE_CLOUD_API_KEY = process.env.GOOGLE_CLOUD_API_KEY
const SERP_API_KEY = process.env.SERP_API_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!)

export async function analyzeImage(formData: FormData) {
  const image = formData.get('image') as File
  if (!image) {
    throw new Error('No image file provided')
  }

  try {
    console.log('Starting image analysis...')
    const buffer = await image.arrayBuffer()
    const base64Image = Buffer.from(buffer).toString('base64')

    const visionUrl = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_API_KEY}`
    const visionPayload = {
      requests: [
        {
          image: { content: base64Image },
          features: [
            { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
            { type: 'TEXT_DETECTION' },
            { type: 'LOGO_DETECTION', maxResults: 5 },
            { type: 'WEB_DETECTION', maxResults: 5 },
          ],
        },
      ],
    }

    console.log('Sending request to Google Cloud Vision API...')
    const visionResponse = await axios.post(visionUrl, visionPayload)
    const visionData = visionResponse.data.responses[0]
    console.log('Received response from Google Cloud Vision API')

    const objects = visionData.localizedObjectAnnotations || []
    const text = visionData.fullTextAnnotation?.text || ''
    const logos = visionData.logoAnnotations || []
    const webDetection = visionData.webDetection || {}

    console.log('Extracting product info...')
    const productInfoList = await Promise.all(
      objects.map((obj: any) => extractProductInfo(obj.name, text, logos, webDetection, base64Image))
    )

    const uniqueProductInfoList = removeDuplicates(productInfoList)
    console.log('Unique product info extracted:', uniqueProductInfoList)

    return { objects, productInfoList: uniqueProductInfoList }
  } catch (error) {
    console.error('Error analyzing image:', error)
    throw error
  }
}

async function extractProductInfo(objectName: string, text: string, logos: any[], webDetection: any, base64Image: string) {
  console.log(`Extracting product info for object: ${objectName}`)
  const productInfo = {
    name: objectName,
    brand: '',
    model: '',
    size: '',
    averagePrice: '',
  }

  if (logos.length > 0) {
    productInfo.brand = logos[0].description
  } else if (webDetection.webEntities && webDetection.webEntities.length > 0) {
    const brandCandidates = webDetection.webEntities
      .filter((entity: any) => entity.score > 0.5)
      .map((entity: any) => entity.description)
    productInfo.brand = brandCandidates[0] || ''
  }

  try {
    const geminiResult = await getGeminiAnalysis(base64Image, text, objectName)
    console.log('Gemini API result:', geminiResult)
    productInfo.brand = geminiResult.brand || productInfo.brand || 'Unknown Brand'
    productInfo.model = geminiResult.model || 'Unknown Model'
    productInfo.size = geminiResult.size || 'Unknown Size'
  } catch (error) {
    console.error('Error in Gemini analysis:', error)
  }

  if (productInfo.model === 'Unknown Model') {
    productInfo.model = extractBasicInfo(text, 'model') || 'Unknown Model'
  }
  if (productInfo.size === 'Unknown Size') {
    productInfo.size = extractBasicInfo(text, 'size') || 'Unknown Size'
  }

  productInfo.brand = productInfo.brand.replace(/by/i, '').trim()
  productInfo.model = productInfo.model.replace(productInfo.brand, '').trim()

  const searchQuery = `${productInfo.brand} ${productInfo.name} ${productInfo.model} ${productInfo.size}`.trim()
  console.log(`Searching for average price with query: ${searchQuery}`)
  productInfo.averagePrice = await searchAveragePrice(searchQuery)

  console.log('Extracted product info:', productInfo)
  return productInfo
}

async function getGeminiAnalysis(base64Image: string, text: string, objectName: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `Analyze this image and the provided text. The object detected is: ${objectName}. Extract or predict the following information about the product, even if you're not entirely certain:

1. Brand name
2. Exact model number or name
3. Size or dimensions

If you're not certain about any of these details, please provide your best guess based on the image, the detected object, and typical characteristics for this type of product. For phones, estimate the screen size.

Provide the information in a JSON format with keys "brand", "model", and "size". Do not use null or empty string values. If you're unsure, provide a prediction and preface it with "". Do not include any additional text, markdown formatting, or code blocks in your response. Only return the JSON object.

Text from the image: ${text}`

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image
        }
      }
    ])

    const response = result.response
    const analysisText = response.text()
    
    try {
      const cleanedText = analysisText.replace(/```json\s*|\s*```/g, '').trim()
      const parsedResult = JSON.parse(cleanedText)
      
      return {
        brand: parsedResult.brand || 'Unknown Brand',
        model: parsedResult.model || 'Unknown Model',
        size: parsedResult.size || 'Unknown Size'
      }
    } catch (jsonError) {
      console.error('Error parsing Gemini API response:', jsonError)
      console.log('Raw Gemini API response:', analysisText)
      return {
        brand: 'Unknown Brand',
        model: 'Unknown Model',
        size: 'Unknown Size'
      }
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error)
    if (error instanceof Error) {
      console.log('Error message:', error.message)
    }
    return {
      brand: 'Unknown Brand',
      model: 'Unknown Model',
      size: 'Unknown Size'
    }
  }
}

function extractBasicInfo(text: string, type: 'model' | 'size'): string {
  const modelPatterns = [
    /\b(model|series)[:.]?\s*([A-Z0-9-]+)/i,
    /\b(iPhone|Galaxy|Pixel)\s*([A-Z0-9]+(\s+(Pro|Max|Plus|Ultra))?)\b/i,
    /\b([A-Z]+[0-9-]+[a-z0-9-]*)\b/,
  ]

  const sizePatterns = [
    /(\d+(\.\d+)?)\s*(inch|"|cm|mm|meters|m)\b/i,
    /(\d+(\.\d+)?)\s*x\s*(\d+(\.\d+)?)\s*(inch|"|cm|mm|meters|m)\b/i,
  ]

  const patterns = type === 'model' ? modelPatterns : sizePatterns

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      return match[0]
    }
  }

  return ''
}

async function searchAveragePrice(query: string): Promise<string> {
  try {
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google_shopping',
        q: query,
        api_key: SERP_API_KEY,
      },
      timeout: 10000, 
    })

    const shoppingResults = response.data.shopping_results || []
    if (shoppingResults.length > 0) {
      const prices = shoppingResults
        .slice(0, 5)
        .map((result: any) => parseFloat(result.price.replace(/[^0-9.]/g, '')))
        .filter((price: number) => !isNaN(price))

      if (prices.length > 0) {
        const averagePrice = prices.reduce((a: number, b: number) => a + b, 0) / prices.length
        return `$${averagePrice.toFixed(2)}`
      }
    }

    return 'N/A'
  } catch (error) {
    console.error('Error searching for average price:', error)
    return 'N/A'
  }
}

function removeDuplicates(productInfoList: any[]) {
  const uniqueProducts = new Map();
  for (const product of productInfoList) {
    const key = `${product.brand}-${product.model}-${product.size}`.toLowerCase();
    if (!uniqueProducts.has(key) || (uniqueProducts.get(key).name === 'Object' && product.name !== 'Object')) {
      uniqueProducts.set(key, product);
    }
  }
  return Array.from(uniqueProducts.values());
}

