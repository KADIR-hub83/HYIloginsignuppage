const getCroppedImg = async (imageSrc: string, cropArea: any, imageType: string): Promise<Blob> => {
  const image = new Image()
  image.src = imageSrc
  await new Promise(resolve => (image.onload = resolve))

  // Validate file type
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) throw new Error('Canvas context is not available')

  canvas.width = cropArea.width
  canvas.height = cropArea.height

  ctx.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    cropArea.width,
    cropArea.height
  )

  return new Promise(resolve => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob)
    }, imageType)
  })
}

export default getCroppedImg
