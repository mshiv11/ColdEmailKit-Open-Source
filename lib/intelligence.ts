import { env } from "~/env"

export type ToolData = {
    description: string
    features: string[]
    pricing: string
    pros: string[]
    cons: string[]
    rating: number
}

export const fetchToolData = async (toolUrl: string): Promise<string> => {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${env.PERPLEXITY_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "llama-3.1-sonar-small-128k-online",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that gathers detailed information about software tools.",
                },
                {
                    role: "user",
                    content: `Analyze the tool at ${toolUrl}. Provide a comprehensive summary including description, key features, pricing model, pros, and cons.`,
                },
            ],
        }),
    })

    if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
}

export const generateContent = async (toolName: string, context: string): Promise<ToolData> => {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${env.MISTRAL_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "mistral-large-latest",
            messages: [
                {
                    role: "system",
                    content: "You are a tech analyst. Extract structured data from the provided context.",
                },
                {
                    role: "user",
                    content: `Based on the following context about ${toolName}, extract and structure the data into JSON format with the following keys: description, features (array of strings), pricing (string summary), pros (array of strings), cons (array of strings), and rating (number 1-100 based on sentiment).

Context:
${context}`,
                },
            ],
            response_format: { type: "json_object" },
        }),
    })

    if (!response.ok) {
        throw new Error(`Mistral API error: ${response.statusText}`)
    }

    const data = await response.json()
    return JSON.parse(data.choices[0].message.content)
}

export const calculateRating = (data: ToolData): number => {
    // Simple rating calculation based on pros/cons ratio and sentiment
    // This is a placeholder for a more complex algorithm
    let score = data.rating || 50

    if (data.pros.length > data.cons.length) {
        score += 5
    }

    if (data.features.length > 5) {
        score += 5
    }

    return Math.min(100, Math.max(0, score))
}
