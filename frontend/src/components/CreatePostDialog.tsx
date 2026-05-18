import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function CreatePostDialog() {
    const [content, setContent] = useState("");

    return (
    <Dialog>
        <DialogTrigger asChild>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">
            Criar publicação
        </button>
        </DialogTrigger>

        <DialogContent>
        <DialogHeader>
            <DialogTitle>Nova publicação</DialogTitle>
        </DialogHeader>

        <textarea
            className="w-full border rounded-md p-3 min-h-[120px]"
            placeholder="Digite sua publicação..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
        />

        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg mt-4">
            Publicar
        </button>
        </DialogContent>
    </Dialog>
    );
}