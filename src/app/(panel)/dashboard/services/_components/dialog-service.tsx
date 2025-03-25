"user client"
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DialogServiceFormData, useDialogServiceForm } from "./dialog-service-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { convertRealToCents } from "@/utils/convertCurrency";
import { createNewService } from "../_actions/create-service";
import { toast } from "sonner";
import { useState } from "react";
import { updateService } from "../_actions/update-service";

interface DialogServiceProps {
  closeModal: () => void;
  serviceId?: string;
  initialValues?: {
    name: string;
    price: string;
    hours: string;
    minutes: string;
  }
}

export function DialogService({ closeModal, initialValues, serviceId }: DialogServiceProps) {

  const form = useDialogServiceForm({ initialValues: initialValues });
  const [loading, setLoafing] = useState(false);

  async function onSubmit(values: DialogServiceFormData) {
    setLoafing(true);
    const priceInCents = convertRealToCents(values.price);
    const hours = parseInt(values.hours) || 0;
    const minutes = parseInt(values.minutes) || 0;

    const duration = (hours * 60) + minutes;

    if (serviceId) {
      await editServiceById({
        serviceId: serviceId,
        name: values.name,
        priceInCents: priceInCents,
        duration: duration
      });
      return;
    }

    const response = await createNewService({
      name: values.name,
      price: priceInCents,
      duration: duration
    });

    setLoafing(false);

    if (response.error) {
      toast.error(response.error);
      return;
    }

    toast.success("Serviço cadastrado com sucesso!")
    handleCloseMOdal();
  }

  async function editServiceById(
    { serviceId, name, priceInCents, duration }:
      { serviceId: string, name: string, priceInCents: number, duration: number }
  ) {
    const response = await updateService({
      serviceId: serviceId,
      name: name,
      price: priceInCents,
      duration: duration
    });

    setLoafing(false);

    if (response.error) {
      toast.error(response.error);
      return;
    }

    toast.success(response.data);
    handleCloseMOdal();
  }

  function handleCloseMOdal() {
    form.reset();
    closeModal();
  }

  function changeCurrency(event: React.ChangeEvent<HTMLInputElement>) {
    let { value } = event.target;
    value = value.replace(/\D/g, '');

    if (value) {
      value = (parseInt(value, 10) / 100).toFixed(2);
      value = value.replace('.', ',');
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }
    event.target.value = value;
    form.setValue("price", value)
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Novo serviço</DialogTitle>
        <DialogDescription>
          Adicione um nodo serviço
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          className="space-y-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col">

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel>
                    Nome do serviço:
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Digite o nome do serviço" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel>
                    Valor do serviço:
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="ex: 120,00"
                      onChange={changeCurrency}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <p>Tempo de duração do serviço</p>
            <div className="grid grid-cols-2 gap-3">

              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem className="my-2">
                    <FormLabel>
                      Horas:
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="hora" min="0" type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minutes"
                render={({ field }) => (
                  <FormItem className="my-2">
                    <FormLabel>
                      Minutos:
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="minutos" min="0" type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
          </div>

          <Button
            disabled={loading}
            type="submit"
            className="w-full text-white bg-gradient-to-bl from-blue-600 to-indigo-500 transition-colors duration-300 hover:from-indigo-600 hover:to-blue-500"
          >
            {loading ? "Carregnado..." : `${serviceId ? "Atualizar serviço" : "Cadastrar serviço"}`}
          </Button>

        </form>
      </Form>
    </>
  )
}