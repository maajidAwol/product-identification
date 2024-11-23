'use client'

import { useState } from 'react'
import ImageUpload from './ImageUpload'
import ResultsTable from './ResultsTable'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'

export interface Product {
  name: string
  brand: string
  model: string
  size: string
  averagePrice: number
}

export default function ProductIdentifier() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = async (file: File) => {
    setIsLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('/api/identify-product', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to process image')
      }

      const data = await response.json()
      setProducts(data)
    } catch (err) {
      setError('An error occurred while processing the image. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadCSV = () => {
    const csvContent = [
      ['Product Name', 'Brand', 'Model', 'Size', 'Average Price'],
      ...products.map(product => [
        product.name,
        product.brand,
        product.model,
        product.size,
        `$${product.averagePrice.toFixed(2)}`
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'product_results.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="space-y-8">
      <ImageUpload onUpload={handleImageUpload} />
      {isLoading && (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {products.length > 0 && (
        <>
          <ResultsTable products={products} />
          <div className="flex justify-center">
            <Button onClick={handleDownloadCSV}>Download CSV</Button>
          </div>
        </>
      )}
    </div>
  )
}

