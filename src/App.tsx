import { useState } from "react"
import { Toaster } from "sonner"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AddImage } from "@/components/addImage"
import { EditImage } from "@/components/editImage"

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleImageSelected = (imageUrl: string) => {
    setSelectedImage(imageUrl)
  }

  const handleEditorClose = () => {
    if (selectedImage) URL.revokeObjectURL(selectedImage)
    setSelectedImage(null)
  }

  return (
    <div className="flex items-center justify-center h-screen">
      {!selectedImage && (
        <AddImage onImageSelected={handleImageSelected}>
          <Button variant="default">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Image
          </Button>
        </AddImage>
      )}
      {selectedImage && <EditImage imageUrl={selectedImage} onClose={handleEditorClose} />}
      <Toaster />
    </div>
  )
}

export default App
