import { useState } from "react";
import { Share2Icon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/lib/toast";

interface ShareButtonProps {
  postId: string;
}

export function ShareButton({ postId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${postId}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      showSuccess("Link copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      showSuccess("Link copiado!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex-1 gap-2 text-muted-foreground text-xs h-9"
      onClick={handleShare}
    >
      {copied ? (
        <CheckIcon className="h-4 w-4 text-green-500" />
      ) : (
        <Share2Icon className="h-4 w-4" />
      )}
      {copied ? "Copiado!" : "Compartilhar"}
    </Button>
  );
}
