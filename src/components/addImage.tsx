import { Upload } from "lucide-react"
import { useState, useEffect, useRef } from "react"

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface AddImageProps {
  children: React.ReactNode
  onImageSelected: (imageUrl: string) => void
}

export const AddImage = ({ children, onImageSelected }: AddImageProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleContinue = () => {
    if (selectedFile) {
      onImageSelected(URL.createObjectURL(selectedFile))
      setIsOpen(false)
      setSelectedFile(null)
      setPreview(null)
    }
  }

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[90%] rounded-lg">
        <DialogHeader>
          <DialogTitle>Add Image</DialogTitle>
          <DialogDescription>Upload a new image by dragging and dropping or selecting a file.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4" onDragOver={handleDragOver} onDrop={handleDrop}>
          <div
            className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <img
                src={preview}
                alt="Image preview"
                loading="lazy"
                className="mx-auto h-40 w-40 object-cover border rounded-md"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-32">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Drag and drop the image here, or click to select a file</p>
              </div>
            )}
            <Input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>
          {selectedFile && (
            <p className="text-sm text-muted-foreground text-center">Selected Image: {selectedFile.name}</p>
          )}
        </div>
        <DialogFooter className="mx-auto">
          <Button onClick={handleContinue} disabled={!preview}>
            Add Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
