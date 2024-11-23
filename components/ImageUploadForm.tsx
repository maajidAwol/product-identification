// // 'use client'

// // import { useState } from 'react'
// // import { analyzeImage } from '../app/actions'

// // export default function ImageUploadForm() {
// //   const [file, setFile] = useState<File | null>(null)
// //   const [isLoading, setIsLoading] = useState(false)

// //   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
// //     e.preventDefault()
// //     if (!file) return

// //     setIsLoading(true)
// //     const formData = new FormData()
// //     formData.append('image', file)

// //     try {
// //       await analyzeImage(formData)
// //     } catch (error) {
// //       console.error('Error analyzing image:', error)
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }

// //   return (
// //     <form onSubmit={handleSubmit} className="mb-6">
// //       <div className="mb-4">
// //         <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">
// //           Upload Image
// //         </label>
// //         <input
// //           id="image-upload"
// //           type="file"
// //           accept="image/*"
// //           onChange={(e) => setFile(e.target.files?.[0] || null)}
// //           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// //         />
// //       </div>
// //       <button
// //         type="submit"
// //         disabled={!file || isLoading}
// //         className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
// //       >
// //         {isLoading ? 'Analyzing...' : 'Analyze Image'}
// //       </button>
// //     </form>
// //   )
// // }

// 'use client'

// import { useState } from 'react'
// import { analyzeImage } from './../app/actions'
// import { useRouter } from 'next/navigation'

// export default function ImageUploadForm() {
//   const [file, setFile] = useState<File | null>(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null)
//   const router = useRouter()

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

//     try {
//       await analyzeImage(formData)
//       router.refresh()
//     } catch (error) {
//       console.error('Error analyzing image:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="flex items-center justify-center w-full">
//         <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
//           <div className="flex flex-col items-center justify-center pt-5 pb-6">
//             {previewUrl ? (
//               <img src={previewUrl} alt="Preview" className="max-h-48 mb-4 rounded" />
//             ) : (
//               <>
//                 <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
//                 <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
//                 <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
//               </>
//             )}
//           </div>
//           <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
//         </label>
//       </div>
//       <button
//         type="submit"
//         disabled={!file || isLoading}
//         className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
//       >
//         {isLoading ? (
//           <>
//             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             Analyzing...
//           </>
//         ) : 'Analyze Image'}
//       </button>
//     </form>
//   )
// }

'use client'

import { useState } from 'react'
import { analyzeImage } from './../app/actions'

export default function ImageUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    setIsLoading(true)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const result = await analyzeImage(formData)
      // Dispatch a custom event with the analysis result
      const event = new CustomEvent('analysisComplete', { detail: result })
      window.dispatchEvent(event)
    } catch (error) {
      console.error('Error analyzing image:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-center w-full">
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="max-h-48 mb-4 rounded" />
            ) : (
              <>
                <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </>
            )}
          </div>
          <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
        </label>
      </div>
      <button
        type="submit"
        disabled={!file || isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : 'Analyze Image'}
      </button>
    </form>
  )
}

