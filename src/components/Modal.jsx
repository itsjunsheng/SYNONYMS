import { X } from "lucide-react"
import { useEffect } from "react"

export default function Modal({ isOpen, onClose, children }) {

  // Close when press Escape Key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Modal content */}
      <div className="relative bg-gray-800 p-6 rounded-2xl max-w-md w-full shadow-2xl mx-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {children}
      </div>
    </div>
  )
}
