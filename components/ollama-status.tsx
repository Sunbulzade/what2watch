"use client";

import { useState, useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { listOllamaModels } from "@/lib/ollama-service";

export default function OllamaStatus() {
  const [isOllamaRunning, setIsOllamaRunning] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkOllamaStatus = async () => {
    setIsChecking(true);
    try {
      const models = await listOllamaModels();
      setIsOllamaRunning(models.length > 0);
    } catch (error) {
      setIsOllamaRunning(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkOllamaStatus();
  }, []);

  if (isOllamaRunning === null || isOllamaRunning === true) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Ollama Not Running</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>
          Ollama appears to be not running on your computer. The chat assistant and recommendations
          require a local installation of Ollama to function. 
        </p>
        <div className="flex items-center gap-2 text-sm">
          <span>Please start Ollama on your computer and</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={checkOllamaStatus}
            disabled={isChecking}
            className="h-7 gap-1"
          >
            {isChecking ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
            Check Again
          </Button>
        </div>
        <p className="text-xs mt-1">
          If you haven't installed Ollama yet, you can get it from <a href="https://ollama.com" target="_blank" rel="noopener noreferrer" className="underline">ollama.com</a>
        </p>
      </AlertDescription>
    </Alert>
  );
}
