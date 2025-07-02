import { Coffee, Flag, Info, Lightbulb, MoreVertical } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function GameMenu({
  onGiveUp,
  isGameActive,
  onShowInstructions,
  onShowCredits,
}) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef()

  // Close menu when click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleClose = () => setOpen(false)

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 text-gray-400 hover:bg-gray-800 rounded-full cursor-pointer animate-slide-left"
        aria-label="Open menu"
      >
        <MoreVertical />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-50 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">

          <MenuItem
            icon={<Lightbulb size={18} />}
            label="How to Play"
            onClick={() => {
              onShowInstructions?.()
              handleClose()
            }}
          />

          <MenuItem
            icon={<Flag size={18} />}
            label="Give Up"
            disabled={!isGameActive}
            onClick={() => {
              if (!isGameActive) return
              onGiveUp?.()
              handleClose()
            }}
          />

          <MenuItem
            icon={<Info size={18} />}
            label="Credits"
            onClick={() => {
              onShowCredits?.()
              handleClose()
            }}
          />

          <MenuItem
            icon={<Coffee size={18} />}
            label="Buy Me a Coffee"
            link="https://buymeacoffee.com/itsjunsheng"
            onClick={handleClose}
          />
        </div>
      )}
    </div>
  )
}

function MenuItem({ icon, label, onClick, link, disabled }) {
  const baseClasses = "flex items-center w-full px-4 py-2 text-sm rounded-md transition-colors"
  const enabledClasses = "text-gray-300 hover:bg-gray-700 cursor-pointer"
  const disabledClasses = "text-gray-500 cursor-not-allowed"

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={`${baseClasses} ${enabledClasses}`}
      >
        <span className="mr-2">{icon}</span>
        {label}
      </a>
    )
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseClasses} ${disabled ? disabledClasses : enabledClasses}`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  )
}
