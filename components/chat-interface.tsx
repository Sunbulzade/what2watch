"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { generateTextWithOllama, listOllamaModels } from "@/lib/ollama-service";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatInterfaceProps = {
  initialQuery: string;
};

export default function ChatInterface({ initialQuery }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("llama3");
  const [isCheckingModels, setIsCheckingModels] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start the conversation with the initial query
    if (initialQuery && messages.length === 0) {
      setMessages([{ role: "user", content: initialQuery }]);
      handleSendMessage(initialQuery, true);
    }
  }, [initialQuery]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch available Ollama models when component mounts
  useEffect(() => {
    async function fetchModels() {
      setIsCheckingModels(true);
      try {
        const models = await listOllamaModels();
        if (models.length > 0) {
          setAvailableModels(models);
          // Set default model to the first one in the list if llama3 is not available
          if (models.length > 0 && !models.includes("llama3")) {
            setSelectedModel(models[0]);
          }
        } else {
          console.warn("No Ollama models found. Make sure Ollama is running.");
        }
      } catch (error) {
        console.error("Failed to fetch Ollama models:", error);
      } finally {
        setIsCheckingModels(false);
      }
    }
    
    fetchModels();
  }, []);

  async function handleSendMessage(message: string, isInitial = false) {
    if (!message.trim() && !isInitial) return;

    setIsLoading(true);
    if (!isInitial) {
      setMessages((prev) => [...prev, { role: "user", content: message }]);
      setInput("");
    }

    try {
      const response = await generateTextWithOllama(message, {
        model: selectedModel,
        system: "You are a friendly movie recommendation assistant. Help users discover films they might enjoy based on their preferences. Respond conversationally about movies, directors, actors, and genres. Keep responses concise and engaging.",
        temperature: 0.7,
      });

      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Error in Ollama chat:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please ensure Ollama is running locally and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-gray-200 shadow-sm transition-all duration-300 ease-in-out">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium text-gray-600">Chat with Ollama AI</div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Settings className="h-3.5 w-3.5" />
                {isCheckingModels ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <span className="text-xs">{selectedModel}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="end">
              <div className="space-y-2">
                <p className="text-sm font-medium">Select Model</p>
                <Select 
                  value={selectedModel} 
                  onValueChange={setSelectedModel}
                  disabled={isCheckingModels || availableModels.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.length > 0 ? (
                      availableModels.map((model) => (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-models" disabled>
                        No models found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {availableModels.length === 0 && !isCheckingModels && (
                  <p className="text-xs text-red-500">
                    No Ollama models found. Please ensure Ollama is running.
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <ScrollArea className="h-[350px] pr-4" ref={scrollAreaRef}>
          <div className="space-y-4 pt-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <div
                      className={`h-full w-full flex items-center justify-center ${
                        message.role === "user"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-cyan-100 text-cyan-600"
                      }`}
                    >
                      {message.role === "user" ? "U" : "AI"}
                    </div>
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2">
                  <Avatar className="h-8 w-8">
                    <div className="h-full w-full flex items-center justify-center bg-cyan-100 text-cyan-600">
                      AI
                    </div>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-gray-100">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2 mt-4">
          <Input
            placeholder="Ask about movies or get more recommendations..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading) {
                handleSendMessage(input);
              }
            }}
            disabled={isLoading}
            className="bg-white border-gray-300"
          />
          <Button
            onClick={() => handleSendMessage(input)}
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
