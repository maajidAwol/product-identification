// import { NextRequest, NextResponse } from 'next/server'
// import { ImageAnnotatorClient } from '@google-cloud/vision'
// import { createWorker } from 'tesseract.js'
// import axios from 'axios'
// import cheerio from 'cheerio'

// const vision = new ImageAnnotatorClient({
//   apiKey: process.env.GOOGLE_CLOUD_API_KEY
// })

// export async function POST(req: NextRequest) {
//   try {
//     if (!process.env.GOOGLE_CLOUD_API_KEY) {
//       throw new Error('GOOGLE_CLOUD_API_KEY is not set')
//     }
//     const formData = await req.formData()
//     const image = formData.get('image') as File
//     if (!image) {
//       return NextResponse.json({ error: 'No image provided' }, { status: 400 })
//     }

//     const buffer = Buffer.from(await image.arrayBuffer())

//     // Perform OCR using Tesseract.js
//     const worker = await createWorker('eng')
//     const { data: { text } } = await worker.recognize(buffer)
//     await worker.terminate()

//     // Use Google Vision API for object detection
//     const [result] = await vision.objectLocalization(buffer)
//     const objects = result.localizedObjectAnnotations

//     // Combine OCR and object detection results
//     const productInfo = extractProductInfo(text, objects)

//     // Get average price
//     const averagePrice = await getAveragePrice(productInfo.name)

//     const product = {
//       name: productInfo.name,
//       brand: productInfo.brand,
//       model: productInfo.model,
//       size: productInfo.size,
//       averagePrice,
//     }

//     return NextResponse.json([product])
//   } catch (error) {
//     console.error('Error processing image:', error)
//     return NextResponse.json({ error: 'Failed to process image' }, { status: 500 })
//   }
// }

// function extractProductInfo(text: string, objects: any[]) {
//   const productInfo = {
//     name: '',
//     brand: '',
//     model: '',
//     size: '',
//   }

//   // Extract information from OCR text
//   const lines = text.split('\n')
//   for (const line of lines) {
//     if (line.match(/(\d+(\.\d+)?)\s*(inch|")/i)) {
//       productInfo.size = line.trim()
//     } else if (line.match(/model:\s*(.*)/i)) {
//       productInfo.model = line.replace(/model:\s*/i, '').trim()
//     } else if (!productInfo.name) {
//       productInfo.name = line.trim()
//     }
//   }

//   // Use object detection results to improve product name
//   if (objects.length > 0) {
//     productInfo.name = objects[0].name
//   }

//   // Extract brand from product name
//   const brandMatch = productInfo.name.match(/^(\w+)/i)
//   if (brandMatch) {
//     productInfo.brand = brandMatch[1]
//   }

//   return productInfo
// }

// async function getAveragePrice(productName: string) {
//   try {
//     const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(productName)}+price`)
//     const $ = cheerio.load(response.data)
//     const priceElements = $('.g .iFjolb.price')
    
//     let totalPrice = 0
//     let count = 0

//     priceElements.each((_, element) => {
//       const priceText = $(element).text()
//       const price = parseFloat(priceText.replace(/[^0-9.]/g, ''))
//       if (!isNaN(price)) {
//         totalPrice += price
//         count++
//       }
//     })

//     return count > 0 ? totalPrice / count : 0
//   } catch (error) {
//     console.error('Error fetching average price:', error)
//     return 0
//   }
// }

import { NextRequest, NextResponse } from 'next/server'
import { ImageAnnotatorClient } from '@google-cloud/vision'
import { createWorker } from 'tesseract.js'
import axios from 'axios'
import * as cheerio from 'cheerio'

const vision = new ImageAnnotatorClient({
  apiKey: process.env.GOOGLE_CLOUD_API_KEY
}) as any;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GOOGLE_CLOUD_API_KEY) {
      throw new Error('GOOGLE_CLOUD_API_KEY is not set')
    }
    const formData = await req.formData()
    const image = formData.get('image') as File
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }
   console.log('image', image)
    const buffer = Buffer.from(await image.arrayBuffer())
    console.log('buffer', buffer)
    // Perform OCR using Tesseract.js
    const worker = await createWorker('eng')
    const { data: { text } } = await worker.recognize(buffer)
    await worker.terminate()
    console.log('text', text)
    // Use Google Vision API for object detection
    const [result] = await vision.objectLocalization(buffer);
    const objects = result?.localizedObjectAnnotations || [];

    // Combine OCR and object detection results
    const productInfo = extractProductInfo(text, objects)
   console.log('productInfo', productInfo)
    // Get average price
    const averagePrice = await getAveragePrice(productInfo.name)

    const product = {
      name: productInfo.name,
      brand: productInfo.brand,
      model: productInfo.model,
      size: productInfo.size,
      averagePrice,
    }

    return NextResponse.json([product])
  } catch (error) {
    console.error('Error processing image:', error)
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 })
  }
}

function extractProductInfo(text: string, objects: any[] = []) {
  const productInfo = {
    name: '',
    brand: '',
    model: '',
    size: '',
  }

  // Extract information from OCR text
  const lines = text.split('\n')
  for (const line of lines) {
    if (line.match(/(\d+(\.\d+)?)\s*(inch|")/i)) {
      productInfo.size = line.trim()
    } else if (line.match(/model:\s*(.*)/i)) {
      productInfo.model = line.replace(/model:\s*/i, '').trim()
    } else if (!productInfo.name) {
      productInfo.name = line.trim()
    }
  }

  // Use object detection results to improve product name
  if (objects.length > 0) {
    productInfo.name = objects[0].name
  }

  // Extract brand from product name
  const brandMatch = productInfo.name.match(/^(\w+)/i)
  if (brandMatch) {
    productInfo.brand = brandMatch[1]
  }

  return productInfo
}

async function getAveragePrice(productName: string) {
  try {
    const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(productName)}+price`)
    const $ = cheerio.load(response.data)
    const priceElements = $('.g .iFjolb.price')
    
    let totalPrice = 0
    let count = 0

    priceElements.each((_, element) => {
      const priceText = $(element).text()
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ''))
      if (!isNaN(price)) {
        totalPrice += price
        count++
      }
    })

    return count > 0 ? totalPrice / count : 0
  } catch (error) {
    console.error('Error fetching average price:', error)
    return 0
  }
}

