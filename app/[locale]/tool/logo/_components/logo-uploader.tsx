'use client'

import { useCallback, useRef, useState } from 'react'
import { Plus, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface LogoUploaderProps {
  onChange: (file: File | null) => void
  previewUrl?: string
  onPreviewChange: (url: string | undefined | null) => void
  className?: string
  uploadText?: string
  hintImg?: string
  hintGif?: string
}

// 压缩图片
async function compressImage(
  file: File,
  type: string,
  quality: number,
  maxWidth: number
): Promise<Blob> {
  const createBitmap = (f: File): Promise<ImageBitmap | HTMLImageElement> => {
    if (typeof window.createImageBitmap === 'function') {
      return createImageBitmap(f)
    }
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = URL.createObjectURL(f)
    })
  }

  const bitmap = await createBitmap(file)
  let width = bitmap.width
  let height = bitmap.height

  if (maxWidth && width > maxWidth) {
    height = (maxWidth / width) * height
    width = maxWidth
  }

  const useOffscreen = typeof OffscreenCanvas !== 'undefined'
  if (useOffscreen) {
    const offscreenCanvas = new OffscreenCanvas(width, height)
    const ctx = offscreenCanvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context is not available')
    ctx.drawImage(bitmap as CanvasImageSource, 0, 0, width, height)
    const blob = await offscreenCanvas.convertToBlob({ type, quality })
    return blob
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context is not available')
  ctx.drawImage(bitmap as CanvasImageSource, 0, 0, width, height)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Failed to convert canvas to blob'))
      },
      type,
      quality
    )
  })
}

export function LogoUploader({
  onChange,
  previewUrl,
  onPreviewChange,
  className,
  uploadText = 'Upload Logo',
  hintImg = 'Supports PNG, JPG, JPEG',
  hintGif = 'GIF max 100KB',
}: LogoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = useCallback(
    async (file: File) => {
      const resetInput = () => {
        if (inputRef.current) inputRef.current.value = ''
      }

      // 基础类型校验
      if (!file.type || !file.type.startsWith('image/')) {
        toast.error('Only image files are allowed')
        resetInput()
        return
      }

      const isGif = file.type === 'image/gif'
      const isPngOrJpeg =
        file.type === 'image/png' || file.type === 'image/jpeg'

      // 大小限制
      const MAX_GIF_BYTES = 100 * 1024 // 100KB
      const MAX_IMG_BYTES = 5 * 1024 * 1024 // 5MB
      const MAX_AFTER_COMPRESS = 100 * 1024 // 100KB

      try {
        if (isGif) {
          if (file.size > MAX_GIF_BYTES) {
            toast.error('GIF size cannot exceed 100KB')
            resetInput()
            return
          }
          const url = URL.createObjectURL(file)
          onPreviewChange(url)
          onChange(file)
        } else if (isPngOrJpeg) {
          if (file.size > MAX_IMG_BYTES) {
            toast.error('PNG/JPG size cannot exceed 5MB')
            resetInput()
            return
          }

          const quality = 0.8
          const maxWidth = 250
          const compressedBlob = await compressImage(
            file,
            file.type,
            quality,
            maxWidth
          )

          if (!compressedBlob || compressedBlob.size > MAX_AFTER_COMPRESS) {
            toast.error('Compressed image still exceeds 100KB, please use a smaller image')
            resetInput()
            return
          }

          const compressedFile = new File([compressedBlob], file.name, {
            type: compressedBlob.type,
          })
          const url = URL.createObjectURL(compressedBlob)
          onPreviewChange(url)
          onChange(compressedFile)
        } else {
          if (file.size > MAX_IMG_BYTES) {
            toast.error('Image size cannot exceed 5MB')
            resetInput()
            return
          }
          const url = URL.createObjectURL(file)
          onPreviewChange(url)
          onChange(file)
        }
      } catch {
        toast.error('Image processing failed, please try again')
        resetInput()
      }
    },
    [onChange, onPreviewChange]
  )

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className={cn('w-full', className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {previewUrl ? (
        <div
          onClick={handleClick}
          className={cn(
            'relative w-50 h-50 border-2 border-dashed rounded-lg cursor-pointer overflow-hidden transition-colors',
            'hover:border-primary',
            isDragging && 'border-primary bg-primary/5'
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Logo preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-white" />
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'w-50 h-50 border-2 border-dashed rounded-lg cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors',
            'hover:border-primary',
            isDragging && 'border-primary bg-primary/5'
          )}
        >
          <Plus className="w-8 h-8 text-muted-foreground" />
          <div className="text-sm text-foreground">{uploadText}</div>
          <div className="text-xs text-muted-foreground">{hintImg}</div>
          <div className="text-xs text-muted-foreground">{hintGif}</div>
        </div>
      )}
    </div>
  )
}
