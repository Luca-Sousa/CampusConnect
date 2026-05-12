import {
  PlusIcon,
  VideoIcon,
  ImageIcon,
  MoreHorizontalIcon,
  ThumbsUpIcon,
  MessageCircleIcon,
  Share2Icon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ---- Data ----------------------------------------------------------------
const stories = [
  { id: 1, name: "Talia", initials: "TA", from: "from-pink-400", to: "to-rose-500" },
  { id: 2, name: "Raniah", initials: "RA", from: "from-blue-400", to: "to-indigo-500" },
  { id: 3, name: "Alex", initials: "AL", from: "from-emerald-400", to: "to-teal-500" },
  { id: 4, name: "Fajar", initials: "FA", from: "from-amber-400", to: "to-orange-500" },
];

const posts = [
  {
    id: 1,
    author: "Kalina Wong",
    initials: "KW",
    avatarFrom: "from-amber-400",
    avatarTo: "to-orange-400",
    time: "2h atrás",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis...",
    images: [
      { gradient: "from-orange-200 via-amber-100 to-yellow-50", aspect: "aspect-[16/9]" },
    ],
  },
  {
    id: 2,
    author: "Pedro Alves",
    initials: "PA",
    avatarFrom: "from-blue-400",
    avatarTo: "to-indigo-500",
    time: "4h atrás",
    content: "Alguém mais assistiu a palestra de hoje sobre arquitetura de microsserviços? Incrível! 🚀",
    images: [],
  },
];

// ---- Sub-components -------------------------------------------------------
interface StoryProps {
  name: string;
  initials: string;
  from: string;
  to: string;
}

const StoryCard = ({ name, initials, from, to }: StoryProps) => (
  <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group select-none">
    <div
      className={`h-18 w-18 rounded-full bg-linear-to-br ${from} ${to} flex items-center justify-center shadow ring-[3px] ring-white group-hover:scale-105 transition-transform`}
    >
      <span className="text-white font-bold text-base drop-shadow">{initials}</span>
    </div>
    <span className="text-xs text-muted-foreground font-medium">{name}</span>
  </div>
);

// ---- Page ----------------------------------------------------------------
const HomePage = () => {
  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-5">

      {/* ── Stories ─────────────────────────────────────────────────── */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-end gap-5 overflow-x-auto pb-1 scrollbar-hide">
            {/* Create story */}
            <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group select-none">
              <div className="h-18 w-18 rounded-full bg-orange-50 border-2 border-dashed border-orange-300 flex items-center justify-center">
                <div className="h-7 w-7 rounded-full bg-orange-400 flex items-center justify-center shadow">
                  <PlusIcon className="h-4 w-4 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <span className="text-xs text-muted-foreground font-medium text-center leading-tight">
                Criar Story
              </span>
            </div>

            {stories.map((story) => (
              <StoryCard key={story.id} {...story} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Post Composer ───────────────────────────────────────────── */}
      <Card className="shadow-sm">
        <CardContent className="p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 shrink-0 ring-2 ring-orange-100">
              <AvatarFallback className="bg-linear-to-br from-orange-400 to-rose-400 text-white font-semibold text-sm">
                LA
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 bg-muted/50 rounded-full px-4 py-2.5 cursor-text text-sm text-muted-foreground hover:bg-muted transition-colors select-none">
              O que você está pensando?
            </div>
          </div>
          <div className="flex gap-1 pt-1 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 gap-2 text-muted-foreground"
            >
              <VideoIcon className="h-4 w-4" />
              Vídeo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 gap-2 text-muted-foreground"
            >
              <ImageIcon className="h-4 w-4" />
              Foto
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Feed ────────────────────────────────────────────────────── */}
      {posts.map((post) => (
        <Card key={post.id} className="shadow-sm overflow-hidden">
          <CardContent className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback
                    className={`text-sm font-semibold bg-linear-to-br ${post.avatarFrom} ${post.avatarTo} text-white`}
                  >
                    {post.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm text-foreground leading-tight">{post.author}</p>
                  <p className="text-xs text-muted-foreground">{post.time}</p>
                </div>
              </div>
              <button className="p-1.5 rounded-full hover:bg-muted text-muted-foreground transition-colors">
                <MoreHorizontalIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Text */}
            <p className="px-4 pb-3 text-sm text-foreground/80 leading-relaxed">
              {post.content}
            </p>

            {/* Images */}
            {post.images.map((img, i) => (
              <div
                key={i}
                className={`w-full ${img.aspect} bg-linear-to-br ${img.gradient}`}
              />
            ))}

            {/* Actions */}
            <div className="flex gap-0 px-2 py-2 border-t mt-1">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 gap-2 text-muted-foreground text-xs"
              >
                <ThumbsUpIcon className="h-4 w-4" />
                Curtir
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 gap-2 text-muted-foreground text-xs"
              >
                <MessageCircleIcon className="h-4 w-4" />
                Comentar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 gap-2 text-muted-foreground text-xs"
              >
                <Share2Icon className="h-4 w-4" />
                Compartilhar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HomePage;
