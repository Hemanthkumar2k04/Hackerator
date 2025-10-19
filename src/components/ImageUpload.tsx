import { useRef } from "react"
import { Button } from "./ui/button"
import { Upload } from "lucide-react"

interface ImageUploadProps {
  onFileSelect: (file: File, previewUrl: string) => void
  onError: (error: string) => void
  previewUrl: string | null
  uploadProgress: number | null
  uploading: boolean
  uploadedUrl: string | null
}

export function ImageUpload({
  onFileSelect,
  onError,
  previewUrl,
  uploadProgress,
  uploading,
  uploadedUrl,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onError("")
    const file = e.target.files?.[0]
    if (!file) return

    // Basic validation
    if (!file.type.startsWith("image/")) {
      onError("Please select a valid image file.")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      onError("Image must be smaller than 10MB.")
      return
    }

    onFileSelect(file, URL.createObjectURL(file))
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 cursor-pointer"
      >
        <Upload className="h-4 w-4" />
        {previewUrl ? "Change Image" : "Upload Image"}
      </Button>

      {uploading && <Button disabled className="ml-2">Uploading...</Button>}

      {previewUrl && (
        <div className="mt-3 flex items-center gap-3">
          <img
            src={previewUrl}
            alt="Preview"
            className="h-20 w-20 rounded-md object-cover border border-emerald-800"
          />
          <div className="flex-1">
            {uploadProgress !== null && uploading && (
              <div className="w-full bg-gray-700 rounded h-2 mt-2">
                <div
                  className="bg-emerald-500 h-2 rounded"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
            {uploadedUrl && (
              <p className="text-sm text-emerald-400">Uploaded successfully.</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
