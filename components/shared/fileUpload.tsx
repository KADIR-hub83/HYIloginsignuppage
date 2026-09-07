'use client'

// lucide-react Imports
import { CloudUpload, X } from 'lucide-react'

export default function FileUploader({
  index,
  onUpload,
  selectedFiles,
}: {
  index: number
  onUpload: (index: number, files: File[]) => void
  selectedFiles: File[]
}) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length) {
      onUpload(index, [...selectedFiles, ...files])
      event.target.value = ''
    }
  }

  const handleFileRemove = (fileIndex: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== fileIndex)
    onUpload(index, newFiles)
  }

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg text-center">
      <input
        type="file"
        id={`file-upload-${index}`}
        className="hidden"
        onChange={handleFileChange}
        multiple
      />
      <label
        htmlFor={`file-upload-${index}`}
        className="cursor-pointer flex flex-col items-center gap-2"
      >
        <CloudUpload size={24} className="text-gray-500" />
        <div className="inline-flex space-x-1">
          <span className="text-sm font-semibold text-primary">Click to upload</span>
          <span className="text-sm font-medium text-gray-500">or drag and drop</span>
        </div>
        <span className="text-xs text-gray-400">.doc, .docx, pdf (max 5MB per file)</span>
      </label>
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {Array.isArray(selectedFiles) &&
            selectedFiles.map((file, fileIndex) => (
              <div
                key={fileIndex}
                className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
              >
                <p className="text-sm text-gray-700">{file.name}</p>
                <button
                  onClick={() => handleFileRemove(fileIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
