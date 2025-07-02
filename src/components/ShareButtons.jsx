import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa"

export default function ShareButtons({ word, time, guesses }) {
  const text = `Found the word "${word}" on SYNONYMS in ${guesses} guesses and ${time} seconds! Try it: https://synonyms.me`
  const encodedText = encodeURIComponent(text)

  const iconStyle =
    "w-6 h-6 sm:w-6 sm:h-6 hover:scale-120 transition-transform duration-200"

  return (
    <div className="flex gap-3 items-center">
      <a
        href={`https://wa.me/?text=${encodedText}`}
        target="_blank"
        rel="noopener noreferrer"
        title="WhatsApp"
      >
        <FaWhatsapp className={`${iconStyle} text-green-600`} />
      </a>
      <a
        href={`https://t.me/share/url?url=${encodedText}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Telegram"
      >
        <FaTelegramPlane className={`${iconStyle} text-blue-600`} />
      </a>
    </div>
  )
}
