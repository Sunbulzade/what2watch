import { generateTextWithOllama } from "./ollama-service"

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
      
      Your response must be valid JSON only, with no additional text or explanation before or after the JSON.
    `

    const responseText = await generateTextWithOllama(prompt, {
      model: "llama3", // Default model
      system:
        "You are a knowledgeable film expert with deep understanding of cinema across all genres, eras, and countries. Provide thoughtful, personalized movie recommendations based on user preferences. Always return properly formatted valid JSON.",
      temperature: 0.7,
    })

    try {
      // Clean up the response to ensure it's valid JSON
      // Some models might return markdown code blocks or additional text
      const jsonText = responseText.replace(/^```json\s*|\s*```$/g, '').trim()
      return JSON.parse(jsonText)
    } catch (parseError) {
      console.error("Failed to parse JSON from model response:", parseError)
      console.log("Raw response:", responseText)
      // Return sample data as fallback
      return getSampleMovieData()
    }
  } catch (error) {
    console.error("Error generating movie recommendations:", error)
    return getSampleMovieData()
  }
}

// Fallback sample data in case of errors
function getSampleMovieData() {
  return [
    {
      id: 1,
      title: "Inception",
      year: 2010,
      poster: "/inception.jpg",
      genres: ["Sci-Fi", "Action", "Thriller"],
      reason: "Mind-bending sci-fi with complex narrative structure",
    },
    {
      id: 2,
      title: "The Matrix",
      year: 1999,
      poster: "/matrix.webp",
      genres: ["Sci-Fi", "Action"],
      reason: "Revolutionary sci-fi with philosophical themes",
    },
    {
      id: 3,
      title: "Interstellar",
      year: 2014,
      poster: "/interstellar.jpg",
      genres: ["Sci-Fi", "Drama", "Adventure"],
      reason: "Epic space journey with emotional depth",
    },
    {
      id: 4,
      title: "Blade Runner 2049",
      year: 2017,
      poster: "/placeholder.svg?height=450&width=300",
      genres: ["Sci-Fi", "Drama", "Mystery"],
      reason: "Visually stunning sci-fi noir with existential themes",
    },
    {
      id: 5,
      title: "Arrival",
      year: 2016,
      poster: "/arrival.webp",
      genres: ["Sci-Fi", "Drama", "Mystery"],
      reason: "Thought-provoking sci-fi with linguistic focus",
    },
    {
      id: 6,
      title: "Ex Machina",
      year: 2014,
      poster: "/placeholder.svg?height=450&width=300",
      genres: ["Sci-Fi", "Drama", "Thriller"],
      reason: "Intimate AI story with psychological elements",
    },
  ]
}
