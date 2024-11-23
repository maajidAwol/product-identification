

'use server'

import axios from 'axios'

const GOOGLE_CLOUD_API_KEY = process.env.GOOGLE_CLOUD_API_KEY
const SERP_API_KEY = process.env.SERP_API_KEY

export async function analyzeImage(formData: FormData) {
  const image = formData.get('image') as File
  if (!image) {
    throw new Error('No image file provided')
  }

  try {
    const buffer = await image.arrayBuffer()
    const base64Image = Buffer.from(buffer).toString('base64')

    const visionUrl = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_API_KEY}`
    const visionPayload = {
      requests: [
        {
          image: { content: base64Image },
          features: [
            { type: 'OBJECT_LOCALIZATION' },
            { type: 'TEXT_DETECTION' },
            { type: 'LOGO_DETECTION' },
            { type: 'WEB_DETECTION' },
          ],
        },
      ],
    }

    const visionResponse = await axios.post(visionUrl, visionPayload)
    const visionData = visionResponse.data.responses[0]

    const objects = visionData.localizedObjectAnnotations || []
    const text = visionData.fullTextAnnotation?.text || ''
    const logos = visionData.logoAnnotations || []
    const webDetection = visionData.webDetection || {}

    const productInfo = await extractProductInfo(text, objects, logos, webDetection)

    return { objects, productInfo }
  } catch (error) {
    console.error('Error analyzing image:', error)
    throw error
  }
}

async function extractProductInfo(text: string, objects: any[], logos: any[], webDetection: any) {
  const productInfo = {
    name: '',
    brand: '',
    model: '',
    size: '',
    averagePrice: '',
  }

  // Extract product name from objects
  if (objects.length > 0) {
    productInfo.name = objects[0].name
  }

  // Extract brand from logos or web entities
  if (logos.length > 0) {
    productInfo.brand = logos[0].description
  } else if (webDetection.webEntities && webDetection.webEntities.length > 0) {
    const brandCandidates = webDetection.webEntities
      .filter((entity: any) => entity.score > 0.5)
      .map((entity: any) => entity.description)
    productInfo.brand = brandCandidates[0] || ''
  }

  // Process text for additional information
  const lines = text.split('\n')
  const sizeRegex = /(\d+(\.\d+)?)\s*(inch|"|cm|mm)/i
  const modelRegex = /\b(model|series)[:.]?\s*([A-Z0-9-]+)/i
  const phoneModelRegex = /\b(iPhone|Galaxy|Pixel)\s*([A-Z0-9]+(\s+(Pro|Max|Plus|Ultra))?)\b/i
  const laptopModelRegex = /\b([A-Z]+[0-9-]+[a-z0-9-]*)\b/

  for (const line of lines) {
    // Extract size
    const sizeMatch = line.match(sizeRegex)
    if (sizeMatch && !productInfo.size) {
      productInfo.size = sizeMatch[0].trim()
    }

    // Extract model
    if (!productInfo.model) {
      const modelMatch = line.match(modelRegex) || line.match(phoneModelRegex) || line.match(laptopModelRegex)
      if (modelMatch) {
        productInfo.model = modelMatch[0].trim()
      }
    }

    // If brand is not found, look for capitalized words that could be brand names
    if (!productInfo.brand) {
      const potentialBrand = line.match(/\b[A-Z][a-z]{2,}\b/)
      if (potentialBrand) {
        productInfo.brand = potentialBrand[0].trim()
      }
    }
  }

  // If size is not found, look for common screen sizes in the text
  if (!productInfo.size) {
    const screenSizes = ['13.3', '14', '15.6', '16', '17.3']
    for (const size of screenSizes) {
      if (text.includes(size)) {
        productInfo.size = `${size} inch`
        break
      }
    }
  }

  // If model is not found, try to extract it from the product name or brand
  if (!productInfo.model) {
    const fullProductInfo = `${productInfo.brand} ${productInfo.name}`.toLowerCase()
    const modelCandidates = fullProductInfo.match(/(?:macbook|thinkpad|xps|spectre|envy|pavilion|inspiron|latitude)\s*([a-z0-9]+)/i)
    if (modelCandidates) {
      productInfo.model = modelCandidates[0].trim()
    }
  }

  // If brand is still not found, try to extract it from the product name
  if (!productInfo.brand && productInfo.name) {
    const brandMatch = productInfo.name.match(/^(\w+)/i)
    if (brandMatch) {
      productInfo.brand = brandMatch[1]
    }
  }

  // Clean up the extracted information
  productInfo.brand = productInfo.brand.replace(/by/i, '').trim()
  productInfo.model = productInfo.model.replace(productInfo.brand, '').trim()

  // Search for average price
  const searchQuery = `${productInfo.brand} ${productInfo.name} ${productInfo.model} ${productInfo.size}`.trim()
  productInfo.averagePrice = await searchAveragePrice(searchQuery)
 console.log("Final productInfo",productInfo);
  return productInfo
}

async function searchAveragePrice(query: string): Promise<string> {
  try {
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google_shopping',
        q: query,
        api_key: SERP_API_KEY,
      },
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

