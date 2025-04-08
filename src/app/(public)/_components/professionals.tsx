import { Card, CardContent } from "@/components/ui/card";
import foto from '../../../../public/foto1.png'
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Prisma } from "@prisma/client";
import { PremiumBadge } from "./premium-badge";

type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true,
  }
}>

interface ProfessionalsProps {
  professionals: UserWithSubscription[];
}

export function Professionals({ professionals }: ProfessionalsProps) {
  return (
    <section className="bg-gray-50 py-16">

      <div className="container mx-auto px-4 pt-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl text-center mb-12">
          Clinicas disponível
        </h2>

        <section className=" grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {professionals.map((clinic) => (
            <Card className="overflow-hidden p-0 hover:shadow-lg duration-300" key={clinic.id}>
              <CardContent className="p-0">
                <div>
                  <div className="relative h-48">
                    <Image
                      src={clinic.image ?? foto}
                      alt="foto da clinica"
                      fill
                      className="object-cover"
                    />
                    {clinic?.subscription?.status === "active" && clinic?.subscription?.plan === "PROFESSIONAL" && <PremiumBadge />}
                  </div>
                </div>

                <div className="p-4 space-y-4 min-h-[160px] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {clinic.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {clinic.address ?? "Endereço não informado"}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/clinica/${clinic.id}`}
                    className="w-full bg-gradient-to-bl from-blue-600 to-indigo-500 transition-colors duration-300 hover:from-indigo-600 hover:to-blue-500 text-white flex items-center justify-center py-2 rounded-md text-sm font-medium md:text-base"
                  >
                    Agendar horario
                    <ArrowRight className="ml-2" />
                  </Link>

                </div>
              </CardContent>
            </Card>
          ))}
        </section>

      </div>

    </section>
  )
}