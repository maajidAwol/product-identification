import { useState, useRef } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface ImageUploadProps {
  onUpload: (file: File) => void
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0])
    }
  }

  const onButtonClick = () => {
    inputRef.current?.click()
  }

  return (
    <form
      className={`relative p-4 text-center border-2 border-dashed rounded-lg transition-colors ${
        dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        accept="image/*"
      />
      <label className="flex flex-col items-center space-y-2 cursor-pointer">
        <span className="text-gray-600">
          Drag and drop your image here, or click to select
        </span>
        <Button type="button" onClick={onButtonClick}>
          Select Image
        </Button>
      </label>
    </form>
  )
}

