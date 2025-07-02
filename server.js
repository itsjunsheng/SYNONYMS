import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import { Groq } from "groq-sdk"

dotenv.config()
const app = express()

// Use Render's PORT or fallback to local dev port
const PORT = process.env.PORT || 3001

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

app.use(cors())
app.use(express.json())

const clueMemory = new Map()

async function generateUniqueClue(word, usedClues) {
  let attempt = 0
  const maxRetries = 10

  while (attempt < maxRetries) {

    const systemPrompt = `
You are a helpful AI that responds with only a single English word that is a valid synonym of the given word.
- The word must be in lowercase.
- It must be a valid English synonym.
- Do not include explanations, punctuation, or multiple words.
- The response must contain exactly one word and nothing else.
`
  const userPrompt = `
Give a single-word English synonym for "${word}" that is NOT one of the following: ${usedClues.length > 0 ? usedClues.join(", ") : "[none]"}.
`
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 1,
      max_completion_tokens: 50,
      top_p: 1,
      stream: false
    })

    const output = response.choices[0]?.message?.content.trim().toLowerCase()
    if (output && !usedClues.includes(output)) return output

    attempt++
  }

  throw new Error("Failed to generate a unique clue after multiple attempts")
}

app.get("/", (req, res) => {
  res.send("Server is running")
})

app.post("/api/word", async (req, res) => {
  const { action, hiddenWord } = req.body

  if (action === "clue") {
    if (!hiddenWord) {
      return res.status(400).json({ error: "Missing hidden word" })
    }

    if (!clueMemory.has(hiddenWord)) {
      clueMemory.set(hiddenWord, [])
    }

    const usedClues = clueMemory.get(hiddenWord)

    try {
      const newClue = await generateUniqueClue(hiddenWord, usedClues)
      clueMemory.get(hiddenWord).push(newClue)
      return res.status(200).json({ clue: newClue })
    } catch (err) {
      return res.status(500).json({ error: "Failed to get new clue" })
    }
  }

  return res.status(400).json({ error: "Invalid action" })
})

// Listen using Render-compatible PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
