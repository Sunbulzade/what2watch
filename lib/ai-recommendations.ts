import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function getMovieRecommendations(query: string) {
  try {
    const prompt = `
      Based on the user's query: "${query}", provide 6 movie recommendations.
      Return the response as a valid JSON array of movie objects with the following structure:
      [
        {
          "id": number,
          "title": string,
          "year": number,
          "poster": string (use "/placeholder.svg?height=450&width=300" for now),
          "genres": string[],
          "reason": string (brief explanation of why this movie is recommended based on the query)
        }
      ]
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
      system:
        "You are a knowledgeable film expert with deep understanding of cinema across all genres, eras, and countries. Provide thoughtful, personalized movie recommendations based on user preferences.",
    })

    // Parse the response as JSON
    return JSON.parse(text)
  } catch (error) {
    console.error("Error generating movie recommendations:", error)
    return []
  }
}
