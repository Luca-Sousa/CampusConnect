import { useRef, useState } from "react";
import { CameraIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AppDialog,
  AppDialogAction,
  AppDialogBody,
  AppDialogContent,
  AppDialogFooter,
  AppDialogHeader,
  DialogTrigger,
} from "@/components/dialog";
import { useUpdateProfile } from "@/features/profile/hooks/use-update-profile";
import { useSession } from "@/lib/auth-client";
import { showError } from "@/lib/toast";
import { getInitials } from "@/lib/utils";

const IMAGE_MAX_BYTES = 2 * 1024 * 1024;

interface ProfileDialogProps {
  user: {
    name: string;
    email: string;
    avatar: string;
    course?: string;
    bio?: string;
  };
  children: React.ReactNode;
}

export function ProfileDialog({ user, children }: ProfileDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { refetch } = useSession();
  const updateProfile = useUpdateProfile({
    onSuccess: () => refetch(),
  });

  const [name, setName] = useState(user.name);
  const [course, setCourse] = useState(user.course ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [image, setImage] = useState<string | null>(null);
  const [hasImageChanged, setHasImageChanged] = useState(false);

  const displayImage = hasImageChanged ? image : user.avatar;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > IMAGE_MAX_BYTES) {
      showError("A imagem deve ter no máximo 2 MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result;
      if (typeof dataUrl === "string") {
        setImage(dataUrl);
        setHasImageChanged(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setHasImageChanged(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = () => {
    updateProfile.mutate(
      {
        name: name.trim(),
        image: hasImageChanged ? (image ?? "") : undefined,
        course: course.trim() || null,
        bio: bio.trim() || null,
      },
      {
        onSuccess: () => {
          setHasImageChanged(false);
        },
      },
    );
  };

  return (
    <AppDialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <AppDialogContent maxWidth="lg">
        <AppDialogHeader
          icon={UserIcon}
          title="Editar perfil"
          description="Atualize suas informações pessoais."
        />

        <AppDialogBody>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-20 w-20">
                <AvatarImage src={displayImage ?? undefined} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CameraIcon className="mr-1.5 size-4" />
                  Alterar foto
                </Button>
                {hasImageChanged && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveImage}
                  >
                    Remover
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="profile-name">Nome</Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="profile-course">Curso</Label>
              <Input
                id="profile-course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="Ex: Ciência da Computação"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="profile-bio">Biografia</Label>
              <Textarea
                id="profile-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Conte um pouco sobre você..."
                rows={3}
              />
            </div>

            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </AppDialogBody>

        <AppDialogFooter>
          <AppDialogAction
            onClick={handleSave}
            disabled={updateProfile.isPending || !name.trim()}
            className="w-full"
          >
            {updateProfile.isPending ? "Salvando..." : "Salvar alterações"}
          </AppDialogAction>
        </AppDialogFooter>
      </AppDialogContent>
    </AppDialog>
  );
}
