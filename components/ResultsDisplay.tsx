// // 'use client'

// // import { useEffect, useState } from 'react'

// // interface ObjectDetection {
// //   name: string
// //   score: number
// // }

// // interface ProductInfo {
// //   name: string
// //   brand: string
// //   model: string
// //   size: string
// // }

// // interface AnalysisResult {
// //   objects: ObjectDetection[]
// //   productInfo: ProductInfo
// // }

// // export default function ResultsDisplay() {
// //   const [result, setResult] = useState<AnalysisResult | null>(null)

// //   useEffect(() => {
// //     const fetchResults = async () => {
// //       // In a real application, you would fetch the results from your backend here
// //       // For this example, we'll use mock data
// //       const mockResult: AnalysisResult = {
// //         objects: [
// //           { name: 'Smartphone', score: 0.95 },
// //           { name: 'Laptop', score: 0.87 },
// //         ],
// //         productInfo: {
// //           name: 'iPhone 12 Pro',
// //           brand: 'Apple',
// //           model: '12 Pro',
// //           size: '6.1 Inch',
// //         },
// //       }
// //       setResult(mockResult)
// //     }

// //     fetchResults()
// //   }, [])

// //   if (!result) {
// //     return null
// //   }

// //   return (
// //     <div className="mt-8">
// //       <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
// //       <div className="bg-gray-50 p-4 rounded-md mb-4">
// //         <h3 className="text-lg font-semibold mb-2">Detected Objects</h3>
// //         <ul className="list-disc pl-5">
// //           {result.objects.map((obj, index) => (
// //             <li key={index}>
// //               {obj.name} (Confidence: {(obj.score * 100).toFixed(2)}%)
// //             </li>
// //           ))}
// //         </ul>
// //       </div>
// //       <div className="bg-gray-50 p-4 rounded-md">
// //         <h3 className="text-lg font-semibold mb-2">Product Information</h3>
// //         <p><strong>Name:</strong> {result.productInfo.name}</p>
// //         <p><strong>Brand:</strong> {result.productInfo.brand}</p>
// //         <p><strong>Model:</strong> {result.productInfo.model}</p>
// //         <p><strong>Size:</strong> {result.productInfo.size}</p>
// //       </div>
// //     </div>
// //   )
// // }

// 'use client'

// import { useEffect, useState } from 'react'

// interface ObjectDetection {
//   name: string
//   score: number
// }

// interface ProductInfo {
//   name: string
//   brand: string
//   model: string
//   size: string
// }

// interface AnalysisResult {
//   objects: ObjectDetection[]
//   productInfo: ProductInfo
// }

// export default function ResultsDisplay() {
//   const [result, setResult] = useState<AnalysisResult | null>(null)

//   useEffect(() => {
//     const fetchResults = async () => {
//       try {
//         const response = await fetch('/api/analysis-results')
//         if (response.ok) {
//           const data = await response.json()
//           setResult(data)
//         }
//       } catch (error) {
//         console.error('Error fetching analysis results:', error)
//       }
//     }

//     fetchResults()
//   }, [])

//   if (!result) {
//     return null
//   }

//   return (
//     <div className="mt-8 space-y-6">
//       <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
//       <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Detected Objects</h3>
//         <ul className="space-y-2">
//           {result.objects.map((obj, index) => (
//             <li key={index} className="flex items-center space-x-2">
//               <span className="inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
//               <span className="text-gray-700">{obj.name} (Confidence: {(obj.score * 100).toFixed(2)}%)</span>
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
//         <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
//           <div>
//             <dt className="text-sm font-medium text-gray-500">Name</dt>
//             <dd className="mt-1 text-sm text-gray-900">{result.productInfo.name}</dd>
//           </div>
//           <div>
//             <dt className="text-sm font-medium text-gray-500">Brand</dt>
//             <dd className="mt-1 text-sm text-gray-900">{result.productInfo.brand}</dd>
//           </div>
//           <div>
//             <dt className="text-sm font-medium text-gray-500">Model</dt>
//             <dd className="mt-1 text-sm text-gray-900">{result.productInfo.model}</dd>
//           </div>
//           <div>
//             <dt className="text-sm font-medium text-gray-500">Size</dt>
//             <dd className="mt-1 text-sm text-gray-900">{result.productInfo.size}</dd>
//           </div>
//         </dl>
//       </div>
//     </div>
//   )
// }

'use client'

import { useEffect, useState } from 'react'

interface ProductInfo {
  name: string
  brand: string
  model: string
  size: string
  averagePrice: string
}

interface AnalysisResult {
  objects: { name: string; score: number }[]
  productInfo: ProductInfo
}

export default function ResultsDisplay() {
  const [result, setResult] = useState<AnalysisResult | null>(null)

  useEffect(() => {
    const handleAnalysisComplete = (event: CustomEvent<AnalysisResult>) => {
      setResult(event.detail)
    }

    window.addEventListener('analysisComplete', handleAnalysisComplete as EventListener)

    return () => {
      window.removeEventListener('analysisComplete', handleAnalysisComplete as EventListener)
    }
  }, [])

  if (!result) {
    return null
  }

  const handleDownloadCSV = () => {
    const headers = ['Product Name', 'Brand', 'Model', 'Size', 'Average Price']
    const data = [
      result.productInfo.name,
      result.productInfo.brand,
      result.productInfo.model,
      result.productInfo.size,
      result.productInfo.averagePrice
    ]

    const csvContent = [
      headers.join(','),
      data.join(',')
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'product_info.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
      <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detected Objects</h3>
        <ul className="space-y-2">
          {result.objects.map((obj, index) => (
            <li key={index} className="flex items-center space-x-2">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
              <span className="text-gray-700">{obj.name} (Confidence: {(obj.score * 100).toFixed(2)}%)</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{result.productInfo.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Brand</dt>
            <dd className="mt-1 text-sm text-gray-900">{result.productInfo.brand}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Model</dt>
            <dd className="mt-1 text-sm text-gray-900">{result.productInfo.model}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Size</dt>
            <dd className="mt-1 text-sm text-gray-900">{result.productInfo.size}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Average Price</dt>
            <dd className="mt-1 text-sm text-gray-900">{result.productInfo.averagePrice}</dd>
          </div>
        </dl>
      </div>
      <button
        onClick={handleDownloadCSV}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
      >
        Download CSV
      </button>
    </div>
  )
}

