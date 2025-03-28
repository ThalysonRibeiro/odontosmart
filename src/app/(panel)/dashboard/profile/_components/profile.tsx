"use client"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProfileFormData, UseProfileForm } from "./profile-form"
import imgtest from "../../../../../../public/foto1.png";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { updateProfile } from "../_actions/update-profile";
import { toast } from "sonner";
import { formatPhone, extractPhoneNumber } from "@/utils/formatPhone";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true,
  }
}>

interface ProfileContentProps {
  user: UserWithSubscription;
}

export function ProfileContent({ user }: ProfileContentProps) {
  const router = useRouter();
  const [selectedHours, setSelectedHours] = useState<string[]>(user.times ?? []);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const { update } = useSession();

  const form = UseProfileForm({
    name: user.name,
    address: user.address,
    phone: user.phone,
    status: user.status,
    timeZone: user.timeZone,
  });

  function generateTimeSlots(): string[] {
    const hours: string[] = [];

    for (let i = 6; i <= 24; i++) {
      for (let j = 0; j < 4; j++) {
        const hour = i.toString().padStart(2, "0");
        const minute = (j * 15).toString().padStart(2, "0")
        hours.push(`${hour === "24" ? "00" : hour}:${minute}`)
      }
    }

    return hours;
  }

  const hours = generateTimeSlots();

  function togglreHour(hour: string) {
    setSelectedHours((prev) => prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour].sort())
  }

  const timeZone = Intl.supportedValuesOf("timeZone").filter((zone) =>
    zone.startsWith("America/Sao_Paulo") ||
    zone.startsWith("America/Fortaleza") ||
    zone.startsWith("America/Recife") ||
    zone.startsWith("America/Bahia") ||
    zone.startsWith("America/Belem") ||
    zone.startsWith("America/Manaus") ||
    zone.startsWith("America/Cuiaba") ||
    zone.startsWith("America/Boa_Vista")
  );

  async function onSubmit(values: ProfileFormData) {

    // const extractValue = extractPhoneNumber(values.phone || "");

    const response = await updateProfile({
      name: values.name,
      address: values.address,
      status: values.status === 'active' ? true : false,
      phone: values.phone,
      timeZone: values.timeZone,
      times: selectedHours || []
    })

    if (response.error) {
      toast.error(response.error)
      return;
    }

    toast.success(response.date)

  }

  async function handleLogout() {
    await signOut();
    await update();
    router.replace("/");
  }

  return (
    <div className="mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>Meu perfil</CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="bg-gray-400 relative h-40 w-40 rounded-full overflow-hidden">
                  <Image
                    src={user.image ? user.image : imgtest}
                    alt="foto da clinica"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Digite o nomo da clinica..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço completo</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Digite o endereço da clinica..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="(99) 99999-9999"
                          onChange={(e) => {
                            const formatedValue = formatPhone(e.target.value)
                            field.onChange(formatedValue)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status da clinica</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value ? "active" : "inactive"}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status da clinica" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Ativo (clinica aberta)</SelectItem>
                            <SelectItem value="inactive">Inativo (clinica fechada)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label>Configurar horários da clinica</Label>

                  <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        Clique aqui para selecionar horários
                        <ArrowRight className="w-6 h-5" />
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Horários da clinica</DialogTitle>
                        <DialogDescription>
                          Selecione os horários de atendimentos da clinica
                        </DialogDescription>
                      </DialogHeader>

                      <section className="py-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          Clique nos horários abaixo para marcar ou desmarcar:
                        </p>

                        <div className="grid grid-cols-5 gap-2">
                          {hours.map((hour) => (
                            <Button
                              key={hour}
                              variant={"outline"}
                              className={cn("h-8", selectedHours.includes(hour) && "border-2 border-blue-500 text-primary")}
                              onClick={() => togglreHour(hour)}
                            >
                              {hour}
                            </Button>
                          ))}
                        </div>
                      </section>
                      <Button
                        onClick={() => setDialogIsOpen(false)}
                        className="text-white bg-gradient-to-bl from-blue-600 to-indigo-500 transition-colors duration-300 hover:from-indigo-600 hover:to-blue-500"
                      >
                        Fechar modal
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>

                <FormField
                  control={form.control}
                  name="timeZone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selecione o fuso horário</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione seu fuso horário" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeZone.map((zone) => (
                              <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  className="w-full text-white bg-gradient-to-bl from-blue-600 to-indigo-500 transition-colors duration-300 hover:from-indigo-600 hover:to-blue-500"
                  type="submit"
                >
                  Salvar alterações
                </Button>

              </div>

            </CardContent>
          </Card>
        </form>
      </Form>
      <section className="mt-4">
        <Button
          className="cursor-pointer"
          variant="destructive"
          onClick={handleLogout}
        >
          Sair da conta
        </Button>
      </section>
    </div>
  )
}