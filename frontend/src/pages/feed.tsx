import { useState } from "react";
import { PostCard } from "@/features/feed/components/PostCard";

// Dados estáticos blindados com 'as any'
const MOCK_POSTS = [
  {
    id: "1",
    type: "news",
    newsTitle: "Inscrições abertas para a Semana de Tecnologia 2026!",
    content: "Participe das palestras, minicursos e hackathons que acontecerão no campus. Não perca a chance de garantir suas horas complementares!",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60",
    createdAt: new Date().toISOString(),
    authorId: "admin-1",
    likesCount: 24,
    commentsCount: 5,
    sharesCount: 12,
    hasLiked: false,
    author: {
      name: "Direção de Ensino IFCE",
      cargo: "professor",
      image: "",
    },
  },
  {
    id: "2",
    type: "event",
    eventTitle: "Festa de Confraternização Junina - IFCE",
    eventDate: new Date(2026, 5, 20).toISOString(),
    eventTime: "18:00",
    eventEndTime: "22:00",
    eventLocation: "Quadra Poliesportiva Principal",
    content: "Traga sua comida típica e venha curtir o nosso arraiá! Teremos quadrilha improvisada e muito forró.",
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=60",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    authorId: "user-2",
    likesCount: 42,
    commentsCount: 8,
    sharesCount: 3,
    hasLiked: true,
    rsvpCount: 87,
    hasRsvp: false,
    author: {
      name: "Lucas de Sousa Silva",
      cargo: "aluno",
      image: "",
    },
  }
] as any[];

const FeedPage = () => {
  const currentUserId = "test-user-id";
  const [posts] = useState(MOCK_POSTS);

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-5">
      <div className="p-4 bg-muted rounded-xl text-center border text-sm font-medium">
        ✨ Modo de Visualização Ativo (Lógica do Servidor Desativada)
      </div>

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          onEdit={() => {}}
        />
      ))}
    </div>
  );
};

export default FeedPage;