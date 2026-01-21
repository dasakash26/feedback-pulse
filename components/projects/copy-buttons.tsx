"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Code, Check } from "lucide-react";
import { generateEmbedScript } from "@/lib/embed";

interface CopyApiKeyButtonProps {
  apiKey: string;
}

export function CopyApiKeyButton({ apiKey }: CopyApiKeyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8"
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="mr-1.5 h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="mr-1.5 h-3.5 w-3.5" />
      )}
      {copied ? "Copied!" : "Copy API Key"}
    </Button>
  );
}

interface EmbedCodeButtonProps {
  apiKey: string;
  baseUrl: string;
}

export function EmbedCodeButton({ apiKey, baseUrl }: EmbedCodeButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    const embedCode = generateEmbedScript(apiKey, baseUrl);
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8"
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="mr-1.5 h-3.5 w-3.5 text-green-500" />
      ) : (
        <Code className="mr-1.5 h-3.5 w-3.5" />
      )}
      {copied ? "Copied!" : "Embed Code"}
    </Button>
  );
}
