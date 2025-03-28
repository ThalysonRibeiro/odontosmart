"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface UserProfileFormProps {
  name: string | null;
  address: string | null;
  phone: string | null;
  status: boolean;
  timeZone: string | null;
}

const profileSchema = z.object({
  name: z.string().min(3, { message: "O nome é obrigatório" }),
  address: z.string().optional(),
  phone: z.string().optional(),
  status: z.string(),
  timeZone: z.string().min(3, { message: "O fuso horário é obrigatório" }),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export function UseProfileForm({ name, address, phone, status, timeZone }: UserProfileFormProps) {
  return useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: name || '',
      address: address || '',
      phone: phone || '',
      status: status ? 'Active' : 'Inactive',
      timeZone: timeZone || '',
    }
  })
}