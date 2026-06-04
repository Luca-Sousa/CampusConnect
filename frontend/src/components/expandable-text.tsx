import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ExpandableTextProps {
  text: string;
  maxLines?: number;
  className?: string;
}

export function ExpandableText({
  text,
  maxLines = 6,
  className,
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  const checkTruncation = useCallback(() => {
    const el = textRef.current;
    if (!el) return;

    const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
    const max_height = lineHeight * maxLines;

    if (el.scrollHeight > max_height + 1) {
      setIsTruncated(true);
    } else {
      setIsTruncated(false);
    }
  }, [maxLines]);

  useEffect(() => {
    checkTruncation();

    const el = textRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => checkTruncation());
    observer.observe(el);

    return () => observer.disconnect();
  }, [checkTruncation, text]);

  if (!text) return null;

  return (
    <div className={cn("px-4 pb-3", className)}>
      <p
        ref={textRef}
        className={cn(
          "text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap",
          !expanded && isTruncated && "line-clamp-6",
        )}
      >
        {text}
      </p>
      {isTruncated && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          {expanded ? "ver menos" : "ver mais"}
        </button>
      )}
    </div>
  );
}
