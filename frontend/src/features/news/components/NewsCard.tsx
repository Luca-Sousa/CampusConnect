import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { NewsItem } from "../types";

interface NewsCardProps {
  item: NewsItem;
}

export function NewsCard({ item }: NewsCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{item.title}</CardTitle>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{item.date}</span>
        </div>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent />
    </Card>
  );
}
