import { useState, useRef, useEffect } from 'react'
import { UploadCloud, Loader2, X } from 'lucide-react'

export default function ImageUploader({ onUploadComplete }) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate type on frontend
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, etc).')
      return
    }

    // Validate size on frontend
    if (file.size > MAX_FILE_SIZE) {
      setError('File is too large. Please select an image under 5MB.')
      return
    }

    // Revoke previous object URL to prevent memory leak
    if (previewUrl) URL.revokeObjectURL(previewUrl)

    // Prepare preview
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setError('')

    // Upload immediately
    await uploadFile(file)
  }

  const uploadFile = async (file) => {
    setIsUploading(true)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const uploadRes = await fetch(`${baseUrl}/api/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      const responseData = await uploadRes.json()

      if (!uploadRes.ok) {
        throw new Error(responseData.error || 'Upload failed')
      }

      onUploadComplete(responseData.url)
    } catch (err) {
      console.error('Upload Error:', err)
      setError(err.message || 'Failed to upload image. Please try again.')
      setPreviewUrl(null) // Clear preview on failure
    } finally {
      setIsUploading(false)
      // Reset input value so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setError('')
    onUploadComplete(null)
  }

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <div className="w-full flex justify-center flex-col gap-4">
      {!previewUrl ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors group aspect-video bg-white ${error ? 'border-red-300 bg-red-50 hover:bg-red-50' : 'border-gray-300 hover:bg-gray-50'}`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${error ? 'bg-red-100' : 'bg-nus-blue/10'}`}
          >
            <UploadCloud className={`w-6 h-6 ${error ? 'text-red-500' : 'text-nus-blue'}`} />
          </div>
          <p className="text-gray-900 font-medium mb-1">Click to upload</p>
          <p className="text-sm text-gray-500">SVG, PNG, JPG or GIF (max. 5MB)</p>

          {error && <p className="text-red-500 text-sm mt-3 font-medium text-center">{error}</p>}
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-white aspect-video flex-shrink-0">
          <img
            src={previewUrl}
            alt="Upload preview"
            className={`w-full h-full object-cover transition-opacity ${isUploading ? 'opacity-50' : 'opacity-100'}`}
          />

          {!isUploading && (
            <button
              type="button"
              onClick={reset}
              className="absolute top-3 right-3 bg-white/80 backdrop-blur p-1.5 rounded-full text-gray-700 hover:bg-white hover:text-red-500 transition-all shadow-sm"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                <Loader2 className="w-4 h-4 text-nus-blue animate-spin" />
                <span className="text-sm font-medium text-gray-700">Uploading...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  )
}
