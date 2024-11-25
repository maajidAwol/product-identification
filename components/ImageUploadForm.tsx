

// 'use client'

// import { useState, useRef } from 'react'
// import { analyzeImage } from './../app/actions'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Loader2, Upload, X } from 'lucide-react'

// export default function ImageUploadForm() {
//   const [file, setFile] = useState<File | null>(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null)
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0]
//     if (selectedFile) {
//       setFile(selectedFile)
//       const url = URL.createObjectURL(selectedFile)
//       setPreviewUrl(url)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     if (!file) return

//     setIsLoading(true)
//     const formData = new FormData()
//     formData.append('image', file)

//     window.dispatchEvent(new Event('analysisStart'))

//     try {
//       console.log('Submitting image for analysis...')
//       const result = await analyzeImage(formData)
//       console.log('Analysis result:', result)
//       const event = new CustomEvent('analysisComplete', { detail: result })
//       window.dispatchEvent(event)
//     } catch (error) {
//       console.error('Error analyzing image:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleRemove = () => {
//     setFile(null)
//     setPreviewUrl(null)
//     if (previewUrl) {
//       URL.revokeObjectURL(previewUrl)
//     }
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ''
//     }
//   }

//   const handleCaptureClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click()
//     }
//   }

//   return (
//     <Card className="w-full max-w-3xl mx-auto">
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-6 py-6">
//           <div className="flex items-center justify-center w-full">
//             <label 
//               htmlFor="dropzone-file" 
//               className={`relative flex flex-col items-center justify-center w-full h-48 sm:h-64 md:h-80 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'border-gray-300'}`}
//             >
//               <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                 {previewUrl ? (
//                   <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded">
//                     <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
//                     {!isLoading && (
//                       <Button
//                         type="button"
//                         variant="secondary"
//                         size="icon"
//                         className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700"
//                         onClick={handleRemove}
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                     )}
//                   </div>
//                 ) : (
//                   <>
//                     <Upload className="w-10 h-10 mb-3 text-gray-400" />
//                     <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
//                     <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
//                   </>
//                 )}
//               </div>
//               <input 
//                 ref={fileInputRef}
//                 id="dropzone-file" 
//                 type="file" 
//                 className="hidden" 
//                 onChange={handleFileChange} 
//                 accept="image/*" 
//                 capture="environment"
//                 disabled={isLoading}
//               />
//             </label>
//           </div>
//           <div className="flex justify-center space-x-4">
//             <Button
//               type="button"
//               onClick={handleCaptureClick}
//               className="bg-blue-500 hover:bg-blue-600 text-white"
//               disabled={isLoading}
//             >
//               Capture Image
//             </Button>
//             <Button
//               type="submit"
//               disabled={!file || isLoading}
//               className="bg-indigo-500 hover:bg-indigo-600 text-white"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Analyzing...
//                 </>
//               ) : 'Analyze Image'}
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }

'use client'

import { useState, useRef } from 'react'
import { analyzeImage } from '../app/actions'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Upload, X } from 'lucide-react'

export default function ImageUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
      const url = URL.createObjectURL(droppedFile)
      setPreviewUrl(url)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    setIsLoading(true)
    const formData = new FormData()
    formData.append('image', file)

    window.dispatchEvent(new Event('analysisStart'))

    try {
      console.log('Submitting image for analysis...')
      const result = await analyzeImage(formData)
      console.log('Analysis result:', result)
      const event = new CustomEvent('analysisComplete', { detail: result })
      window.dispatchEvent(event)
    } catch (error) {
      console.error('Error analyzing image:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = () => {
    setFile(null)
    setPreviewUrl(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    // Dispatch an event to clear the analysis results
    window.dispatchEvent(new Event('analysisClear'))
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          <div className="flex items-center justify-center w-full">
            <label 
              htmlFor="dropzone-file" 
              className={`relative flex flex-col items-center justify-center w-full h-48 sm:h-64 md:h-80 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'border-gray-300'}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {previewUrl ? (
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded">
                    <img src={previewUrl} alt="Preview" className="h-48 sm:h-64 md:h-80 w-full object-cover" />
                    {!isLoading && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700"
                        onClick={handleRemove}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
              <input 
                ref={fileInputRef}
                id="dropzone-file" 
                type="file" 
                className="hidden" 
                onChange={handleFileChange} 
                accept="image/*" 
                disabled={isLoading}
              />
            </label>
          </div>
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={!file || isLoading}
              className="bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : 'Analyze Image'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

