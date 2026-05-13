import type { Post, Story } from "./types";

export const mockStories: Story[] = [
  { id: 1, name: "Talia", initials: "TA", from: "from-pink-400", to: "to-rose-500" },
  { id: 2, name: "Raniah", initials: "RA", from: "from-blue-400", to: "to-indigo-500" },
  { id: 3, name: "Alex", initials: "AL", from: "from-emerald-400", to: "to-teal-500" },
  { id: 4, name: "Fajar", initials: "FA", from: "from-amber-400", to: "to-orange-500" },
];

export const mockPosts: Post[] = [
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
