import { NewsCard } from "@/features/news/components/NewsCard";
import { mockNewsItems } from "@/features/news/data";

const NewsPage = () => {
  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Notícias</h1>
        <div className="flex flex-col gap-4">
          {mockNewsItems.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
