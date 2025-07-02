import { useEffect, useRef } from "react"

export default function InputField({ onSubmit, disabled }) {
  // Ref to access the input element directly
  const inputRef = useRef(null)

  // Place cursor on the input field automatically
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus()
    }
  }, [disabled])

  // Prevent spacebar from being typed
  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault()
    }
  }

  // Clean input: only allow lowercase letters (a-z)
  const handleInput = (e) => {
    const value = e.target.value
    const cleanValue = value.replace(/[^a-zA-G]/g, "") // remove anything not a-z
    if (value !== cleanValue) {
      e.target.value = cleanValue
    }
  }

  // Clean pasted text: only allow lowercase letters (a-z)
  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = (e.clipboardData || window.clipboardData).getData("text")
    const cleanText = pasted.replace(/[^a-zA-G]/g, "")
    document.execCommand("insertText", false, cleanText)
  }

  return (
    <form
      // Handle form submission
      onSubmit={(e) => {
        onSubmit(e)

        // Re-focus input after submission (after reset)
        setTimeout(() => {
          if (inputRef.current && !disabled) inputRef.current.focus()
        }, 0)
      }}
    >
      <div className="flex gap-4">
        <input
          ref={inputRef} // for focus control
          type="text"
          name="guess" // name used to extract the guess from form
          placeholder="Guess a word"
          disabled={disabled}
          autoComplete="off"
          onKeyDown={handleKeyDown} // block spacebar
          onInput={handleInput}     // block invalid characters
          onPaste={handlePaste}     // clean pasted input
          className="flex-1 text-white px-4 py-1.5 border border-gray-400 rounded-md shadow-sm focus:outline-none placeholder-gray-600"
          maxLength={20} // limit word length
        />
      </div>
    </form>
  )
}
