
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'

interface ProductInfo {
  name: string
  brand: string
  model: string
  size: string
  averagePrice: string
}

interface AnalysisResult {
  objects: { name: string; score: number }[]
  productInfoList: ProductInfo[]
}

export default function ResultsDisplay() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleAnalysisComplete = (event: CustomEvent<AnalysisResult>) => {
      setResult(event.detail)
      setIsLoading(false)
    }

    const handleAnalysisStart = () => {
      setIsLoading(true)
      setResult(null)
    }

    const handleAnalysisClear = () => {
      setResult(null)
      setIsLoading(false)
    }

    window.addEventListener('analysisComplete', handleAnalysisComplete as EventListener)
    window.addEventListener('analysisStart', handleAnalysisStart as EventListener)
    window.addEventListener('analysisClear', handleAnalysisClear as EventListener)

    return () => {
      window.removeEventListener('analysisComplete', handleAnalysisComplete as EventListener)
      window.removeEventListener('analysisStart', handleAnalysisStart as EventListener)
      window.removeEventListener('analysisClear', handleAnalysisClear as EventListener)
    }
  }, [])

  const handleDownloadCSV = () => {
    if (!result) return

    const headers = ['Product Name', 'Brand', 'Model', 'Size', 'Average Price']
    const csvContent = [
      headers.join(','),
      ...result.productInfoList.map(product => 
        [product.name, product.brand, product.model, product.size, product.averagePrice].join(',')
      )
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

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (!result) {
    return null
  }

  return (
    <div className="mt-8 space-y-6 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-900">Analysis Results</h2>
      <Card>
        <CardHeader>
          <CardTitle>Detected Objects</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {result.objects.map((obj, index) => (
              <li key={index} className="flex items-center space-x-2">
                <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                <span className="text-gray-700">{obj.name} (Confidence: {(obj.score * 100).toFixed(2)}%)</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      {result.productInfoList.map((product, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>Product Information: {product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              {Object.entries(product).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-sm font-medium text-gray-500 capitalize">{key}</dt>
                  <dd className="mt-1 text-sm text-gray-900">{value || 'N/A'}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      ))}
      <Button
        onClick={handleDownloadCSV}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        <Download className="mr-2 h-4 w-4" /> Download CSV
      </Button>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="mt-8 space-y-6 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {[1, 2].map((i) => (
        <Card key={i}>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j}>
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  <div className="mt-1 h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
    </div>
  )
}


