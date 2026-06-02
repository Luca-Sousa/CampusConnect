import { useState } from "react";
import { PencilLineIcon } from "lucide-react";
import {
  AppDialog,
  AppDialogAction,
  AppDialogBody,
  AppDialogCancel,
  AppDialogContent,
  AppDialogFooter,
  AppDialogHeader,
  DialogTrigger,
} from "@/components/dialog";
import { Button } from "@/components/ui/button";

export default function CreatePostDialog() {
    const [content, setContent] = useState("");

    const handlePublish = () => {
        console.log({ content });
        // TODO: integração com PostComposer / create-post
    };

    return (
    <AppDialog>
        <DialogTrigger asChild>
            <Button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
                Criar publicação
            </Button>
        </DialogTrigger>

        <AppDialogContent maxWidth="md">
            <AppDialogHeader
                icon={PencilLineIcon}
                title="Nova publicação"
                description="Escreva o que você está pensando."
            />

            <AppDialogBody>
                <textarea
                    className="w-full border rounded-md p-3 min-h-30"
                    placeholder="Digite sua publicação..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </AppDialogBody>

            <AppDialogFooter>
                <AppDialogCancel>Cancelar</AppDialogCancel>
                <AppDialogAction onClick={handlePublish}>Publicar</AppDialogAction>
            </AppDialogFooter>
        </AppDialogContent>
    </AppDialog>
    );
}
