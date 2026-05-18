import { useState } from "react";
import { Button } from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";

interface ProfileDialogProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    role?: string;
  };

  children: React.ReactNode;
}

export function ProfileDialog({
  user,
  children,
}: ProfileDialogProps) {
  const [name, setName] = useState(user.name);
  const [course, setCourse] = useState("");
  const [bio, setBio] = useState("");

  const handleSave = () => {
    console.log({
      name,
      course,
      bio,
    });
    // TODO: integração backend
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border"
            />
            <Button variant="outline">
              Alterar foto
            </Button>
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome"
            className="border rounded-md px-3 py-2"
          />
          <input
            type="text"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="Curso"
            className="border rounded-md px-3 py-2"
          />
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Biografia"
            className="border rounded-md px-3 py-2 min-h-[100px]"
          />
          <div className="text-sm text-muted-foreground">
            Tipo de usuário: {user.role || "Aluno"}
          </div>
          <Button onClick={handleSave}>
            Salvar alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}