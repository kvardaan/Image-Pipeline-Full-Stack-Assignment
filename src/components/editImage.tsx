import { toast } from "sonner"
import { Undo } from "lucide-react"
import ReactCanvasDraw from "react-canvas-draw"
import { useEffect, useRef, useState } from "react"

import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface EditImageProps {
  imageUrl: string
  onClose: () => void
}

export const EditImage = ({ imageUrl, onClose }: EditImageProps) => {
  const [brushSize, setBrushSize] = useState(8)
  const [maskImage, setMaskImage] = useState<string | null>(null)
  const [blackMaskImage, setBlackMaskImage] = useState<string | null>(null)
  const [combinedImage, setCombinedImage] = useState<string | null>(null)
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false)
  const canvasRef = useRef<ReactCanvasDraw | null>(null)

  useEffect(() => {
    const img = new Image()
    img.onload = () => setIsImageLoaded(true)

    img.onerror = () => {
      toast.error("Failed to load image")
      onClose()
    }
    img.src = imageUrl
  }, [imageUrl, onClose])

  const handleBrushSizeChange = (value: number[]) => {
    setBrushSize(value[0])
  }

  const handleUndo = () => {
    canvasRef.current?.undo()
  }

  const handleClear = () => {
    canvasRef.current?.clear()
  }

  const generateMask = () => {
    if (!canvasRef.current) return

    const drawingCanvas = canvasRef.current.canvas.drawing
    const ctx = drawingCanvas.getContext("2d")
    if (!ctx) return

    const transparentMaskCanvas = document.createElement("canvas")
    transparentMaskCanvas.width = drawingCanvas.width
    transparentMaskCanvas.height = drawingCanvas.height
    const transparentMaskCtx = transparentMaskCanvas.getContext("2d")
    if (!transparentMaskCtx) return

    transparentMaskCtx.clearRect(0, 0, transparentMaskCanvas.width, transparentMaskCanvas.height)
    transparentMaskCtx.drawImage(drawingCanvas, 0, 0)
    const transparentMaskDataUrl = transparentMaskCanvas.toDataURL("image/png")
    setMaskImage(transparentMaskDataUrl)

    const blackMaskCanvas = document.createElement("canvas")
    blackMaskCanvas.width = drawingCanvas.width
    blackMaskCanvas.height = drawingCanvas.height
    const blackMaskCtx = blackMaskCanvas.getContext("2d")
    if (!blackMaskCtx) return

    blackMaskCtx.fillStyle = "black"
    blackMaskCtx.fillRect(0, 0, blackMaskCanvas.width, blackMaskCanvas.height)
    blackMaskCtx.drawImage(drawingCanvas, 0, 0)
    setBlackMaskImage(blackMaskCanvas.toDataURL("image/png"))

    const combinedCanvas = document.createElement("canvas")
    combinedCanvas.width = transparentMaskCanvas.width
    combinedCanvas.height = transparentMaskCanvas.height
    const combinedCtx = combinedCanvas.getContext("2d")
    if (!combinedCtx) return

    const originalImage = new Image()
    originalImage.onload = () => {
      combinedCtx.drawImage(originalImage, 0, 0, combinedCanvas.width, combinedCanvas.height)

      const maskImg = new Image()
      maskImg.onload = () => {
        combinedCtx.globalCompositeOperation = "source-atop"
        combinedCtx.drawImage(transparentMaskCanvas, 0, 0)
        setCombinedImage(combinedCanvas.toDataURL("image/png"))
      }
      maskImg.src = transparentMaskDataUrl
    }
    originalImage.src = imageUrl
  }

  const downloadImage = (imageDataUrl: string, filename: string) => {
    const link = document.createElement("a")
    link.href = imageDataUrl
    link.download = filename
    link.click()
  }

  if (!isImageLoaded) {
    return (
      <div className="flex items-center justify-center w-[90%] max-w-4xl m-2 border p-4 rounded-lg h-[600px]">
        <div className="text-center text-muted-foreground">Unable to load the image. Please try again.</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-3 w-[90%] max-w-4xl m-2 border p-4 rounded-lg">
      <div>
        <h3 className="text-xl font-semibold">Create Image Mask</h3>
        <p className="text-muted-foreground">
          Draw on the image to create a mask. White areas will indicate the areas you've drawn.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-grow">
            <label className="text-sm text-muted-foreground">Brush Size</label>
            <Slider
              value={[brushSize]}
              onValueChange={handleBrushSizeChange}
              min={1}
              max={20}
              step={1}
              className="my-2"
            />
          </div>
          <Button variant="outline" size="icon" onClick={handleUndo}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
        </div>

        <div className="border rounded-lg p-4">
          {isImageLoaded && (
            <ReactCanvasDraw
              ref={canvasRef}
              brushRadius={brushSize}
              brushColor="white"
              backgroundColor="black"
              canvasWidth={800}
              canvasHeight={400}
              imgSrc={imageUrl}
              className="mx-auto"
              hideGrid={true}
            />
          )}
        </div>

        {blackMaskImage && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-2">Original Image</p>
              <img src={imageUrl} alt="Original" className="w-full h-48 object-contain border rounded" />
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Generated Mask</p>
              <img src={blackMaskImage!} alt="Mask" className="w-full h-48 object-contain border rounded" />
            </div>
            {combinedImage && (
              <Button
                className="w-fit mx-auto"
                onClick={() => downloadImage(combinedImage, `${imageUrl.split("/").pop()}-edited.png`)}
              >
                Download Edited Image
              </Button>
            )}
            <Button
              className="w-fit mx-auto"
              onClick={() => blackMaskImage && downloadImage(blackMaskImage, "mask.png")}
            >
              Download Mask
            </Button>
          </div>
        )}
      </div>

      <div className="text-center space-x-3">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={generateMask} disabled={maskImage ? true : false}>
          Generate Mask
        </Button>
      </div>
    </div>
  )
}
