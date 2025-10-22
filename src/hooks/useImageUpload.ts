import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface UseImageUploadResult {
  selectedFile: File | null
  previewUrl: string | null
  uploadedUrl: string | null
  uploading: boolean
  uploadProgress: number | null
  error: string | null
  setFile: (file: File, previewUrl: string) => void
  setError: (error: string) => void
  uploadFile: () => Promise<void>
  reset: () => void
}

/**
 * Custom hook to handle image file selection and upload to Supabase.
 */
export function useImageUpload(userId: string | undefined): UseImageUploadResult {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const setFile = (file: File, preview: string) => {
    setSelectedFile(file)
    setPreviewUrl(preview)
  }

  const uploadFile = async () => {
    if (!selectedFile || !userId) {
      setError('File or user ID missing')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const { data: authSession } = await supabase.auth.getSession()
      const accessToken = authSession?.session?.access_token

      if (!accessToken) {
        setError('No active session found. Please sign in again.')
        return
      }

      // Use XMLHttpRequest for progress tracking
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-image`)
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100)
            setUploadProgress(percent)
          }
        }

        xhr.onload = () => {
          let resData = null
          try {
            resData = xhr.responseText ? JSON.parse(xhr.responseText) : null
          } catch (e) {
            console.warn('Non-JSON response from upload function', xhr.responseText)
            console.log(e)
          }

          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadedUrl(resData?.publicUrl || null)
            setError(null)
            resolve()
          } else {
            setError(resData?.error || xhr.responseText || `Upload failed (${xhr.status})`)
            reject()
          }
        }

        xhr.onerror = () => {
          setError('Network error during upload.')
          reject()
        }

        const form = new FormData()
        form.append('file', selectedFile)
        xhr.send(form)
      })
    } catch (err: unknown) {
      console.error(err)
      setError((err as Error)?.message || String(err))
    } finally {
      setUploading(false)
      setUploadProgress(null)
    }
  }

  const reset = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setUploadedUrl(null)
    setError(null)
  }

  return {
    selectedFile,
    previewUrl,
    uploadedUrl,
    uploading,
    uploadProgress,
    error,
    setFile,
    setError,
    uploadFile,
    reset,
  }
}
