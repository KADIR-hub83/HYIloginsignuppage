// React Imports
import React, { useState, useCallback, useEffect } from 'react'
import Cropper from 'react-easy-crop'
import { UseFormReturn, FieldValues, Path, PathValue } from 'react-hook-form'

// shadcn Imports
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// Config Import
import getCroppedImg from '@/lib/helper/cropImage'

// lucide-react Imports
import { X, User, Camera } from 'lucide-react'

interface ImagePickerProps<FormType extends FieldValues> {
  form: UseFormReturn<FormType>
  name: Path<FormType>
  onImageSelect: (file: File | null) => void
  savedImage?: string
  height?: string
  width?: string
  isLabelVisible?: boolean
  isCamera?: boolean
}

const UserImage = <FormType extends FieldValues>({
  form,
  name,
  onImageSelect,
  savedImage,
  width = 'w-32',
  height = 'h-32',
  isLabelVisible = false,
  isCamera = false,
}: ImagePickerProps<FormType>) => {
  const [image, setImage] = useState<string | null>(null)
  const [imageType, setImageType] = useState<string>('')
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [originalFileName, setOriginalFileName] = useState<string | null>(null)

  useEffect(() => {
    if (savedImage) {
      setCroppedImage(savedImage)

      // Convert URL to File if needed
      fetch(savedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'cropped_image.png', { type: blob.type })
          form.setValue(name, file as PathValue<FormType, Path<FormType>>)
          form.trigger(name)
          onImageSelect(file)
        })
        .catch(error => console.error('Failed to fetch image:', error))
    }
  }, [savedImage])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setOriginalFileName(selectedFile.name)
      setImageType(selectedFile.type)
      const imageUrl = URL.createObjectURL(selectedFile)
      setImage(imageUrl)
      form.trigger(name)
      setIsCropModalOpen(true) // Open crop modal
    }
  }

  const onCropComplete = useCallback(
    (_: any, croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  const handleCropConfirm = async () => {
    if (!image || !croppedAreaPixels) return
    try {
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels, imageType)
      const croppedFile = new File([croppedBlob], `${originalFileName}`, { type: imageType })

      const newImageURL = URL.createObjectURL(croppedBlob)
      setCroppedImage(newImageURL)
      setIsCropModalOpen(false)

      form.setValue(name, croppedFile as PathValue<FormType, Path<FormType>>)
      form.trigger(name)

      onImageSelect(croppedFile)
    } catch (error) {
      console.error('Cropping failed', error)
    }
  }

  const handleRemoveImage = () => {
    setCroppedImage(null)
    setImage(null)
    form.setValue(name, null as PathValue<FormType, Path<FormType>>)
    form.trigger(name)
    onImageSelect(null)
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="w-full flex flex-col text-center items-center space-y-1.5">
            <FormLabel className={`${isLabelVisible ? 'opacity-100' : 'hidden'}`}>
              Profile Image
            </FormLabel>
            <FormControl>
              <>
                <div
                  className={`relative ${width} ${height} flex items-center justify-center  border-2 border-border rounded-full cursor-pointer bg-[#F5F5F5]`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full rounded-full opacity-0 cursor-pointer"
                  />
                  {croppedImage ? (
                    <>
                      <img
                        src={croppedImage || field.value}
                        alt="Profile Preview"
                        className="w-full h-full object-cover rounded-full"
                      />
                      <button
                        type="button"
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                        onClick={handleRemoveImage}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : isCamera ? (
                    <Camera strokeWidth={1.0} className="w-16 h-16 text-muted-foreground" />
                  ) : (
                    <User strokeWidth={1.5} className="w-16 h-16 text-muted-foreground" />
                  )}
                </div>
                <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
                  <DialogContent className="w-[90%] max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Crop Image</DialogTitle>
                    </DialogHeader>
                    <div className="relative w-full h-64">
                      <Cropper
                        image={image!}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                      />
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" onClick={() => setIsCropModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCropConfirm}>Confirm</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            </FormControl>
            <FormMessage className="text-xs" isErrorPresent />
          </FormItem>
        )
      }}
    />
  )
}

export default UserImage
