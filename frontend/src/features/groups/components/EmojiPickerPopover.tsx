import { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { SmileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface EmojiPickerPopoverProps {
  value: string | null;
  onChange: (emoji: string | null) => void;
  disabled?: boolean;
}

export function EmojiPickerPopover({
  value,
  onChange,
  disabled,
}: EmojiPickerPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={disabled}
          className="h-14 w-14 shrink-0 rounded-xl text-2xl"
        >
          {value ?? <SmileIcon className="h-6 w-6 text-muted-foreground" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        className="w-auto p-0"
      >
        <Picker
          data={data}
          theme="dark"
          locale="pt"
          perLine={8}
          emojiSize={24}
          emojiButtonSize={36}
          maxFrequentRows={2}
          previewPosition="none"
          skinTonePosition="none"
          onEmojiSelect={(emoji: { native?: string }) => {
            onChange(emoji.native ?? null);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
