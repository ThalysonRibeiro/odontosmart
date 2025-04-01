"use client"
import { Button } from "@/components/ui/button";
import { Link2Icon } from "lucide-react";
import { toast } from "sonner";

export function ButtonCopyLink({ userId }: { userId: string }) {

  async function handleCopyLink() {
    await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/clinica/${userId}`);
    toast("Link copiado com sucesso");
  }

  return (
    <Button onClick={handleCopyLink}>
      <Link2Icon />
    </Button>
  )
}