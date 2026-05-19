import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CARGO_OPTIONS } from "../constants";

interface CargoSelectProps {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  errors?: string[];
}

export function CargoSelect({
  id = "cargo",
  value,
  onValueChange,
  onBlur,
  errors = [],
}: CargoSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>Cargo</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} onBlur={onBlur}>
          <SelectValue placeholder="Selecione seu cargo" />
        </SelectTrigger>
        <SelectContent>
          {CARGO_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.length > 0 && (
        <p className="text-destructive text-xs">{errors.join(", ")}</p>
      )}
    </div>
  );
}
