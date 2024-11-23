// // // import ProductIdentifier from '../components/ProductIdentifier'

// // // export default function Home() {
// // //   return (
// // //     <main className="container mx-auto px-4 py-8">
// // //       <h1 className="text-3xl font-bold mb-8 text-center">Product Identification Tool</h1>
// // //       <ProductIdentifier />
// // //     </main>
// // //   )
// // // }

// // import ImageUploadForm from './../components/ImageUploadForm'
// // import ResultsDisplay from './../components/ResultsDisplay'

// // export default function Home() {
// //   return (
// //     <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
// //       <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
// //         <h1 className="text-3xl font-bold text-center mb-6">Object Identification</h1>
// //         <ImageUploadForm />
// //         <ResultsDisplay />
// //       </div>
// //     </main>
// //   )
// // }



import ImageUploadForm from './../components/ImageUploadForm'
import ResultsDisplay from './../components/ResultsDisplay'

// export default function Home() {
//   return (
//     <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
//           Object Identification Tool
//         </h1>
//         <div className="bg-white shadow-xl rounded-lg overflow-hidden">
//           <div className="p-6 sm:p-8">
//             <ImageUploadForm />
//             <ResultsDisplay />
//           </div>
//         </div>
//       </div>
//     </main>
//   )
// }

// import ImageUploadForm from './components/ImageUploadForm'
// import ResultsDisplay from './components/ResultsDisplay'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
          Product Identification Tool
        </h1>
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <ImageUploadForm />
            <ResultsDisplay />
          </div>
        </div>
      </div>
    </main>
  )
}

