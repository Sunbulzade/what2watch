/**
 * This service handles communication with a local Ollama instance
 */

interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  system?: string;
  template?: string;
  context?: number[];
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    num_predict?: number;
    repeat_penalty?: number;
    repeat_last_n?: number;
    seed?: number;
    stop?: string[];
    tfs_z?: number;
    num_ctx?: number;
    mirostat?: number;
    mirostat_tau?: number;
    mirostat_eta?: number;
    num_gpu?: number;
    num_thread?: number;
    num_batch?: number;
  };
  stream?: boolean;
}

interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

/**
 * Default Ollama host URL
 * Default port for Ollama is 11434
 */
const OLLAMA_HOST = "http://localhost:11434";

/**
 * Default model to use
 */
const DEFAULT_MODEL = "llama3";

/**
 * Generate text from a local Ollama model
 */
export async function generateTextWithOllama(
  prompt: string,
  options: {
    model?: string;
    system?: string;
    temperature?: number;
  } = {}
): Promise<string> {
  const { model = DEFAULT_MODEL, system, temperature = 0.7 } = options;
  
  try {
    const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        system,
        options: {
          temperature,
        },
        stream: false,
      } as OllamaGenerateRequest),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as OllamaGenerateResponse;
    return data.response;
  } catch (error) {
    console.error("Error generating text with Ollama:", error);
    throw error;
  }
}

/**
 * List available models on the local Ollama instance
 */
export async function listOllamaModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_HOST}/api/tags`);
    
    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.models.map((model: any) => model.name);
  } catch (error) {
    console.error("Error listing Ollama models:", error);
    return [];
  }
}
