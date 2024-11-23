// import { cookies } from 'next/headers'
// import { NextResponse } from 'next/server'

// export async function GET() {
//   const cookieStore = await cookies()
//   const analysisResult = cookieStore.get('analysisResult')

//   if (analysisResult) {
//     return NextResponse.json(JSON.parse(analysisResult.value))
//   } else {
//     return NextResponse.json({ error: 'No analysis result found' }, { status: 404 })
//   }
// }

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = cookies()
  const analysisResult = (await cookieStore).get('analysisResult')

  if (analysisResult) {
    return NextResponse.json(JSON.parse(analysisResult.value))
  } else {
    return NextResponse.json({ error: 'No analysis result found' }, { status: 404 })
  }
}

