import { Card, CardContent } from "@/components/ui/card";
import foto from '../../../../public/foto1.png'
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Professionals() {
  return (
    <section className="bg-gray-50 py-16">

      <div className="container mx-auto px-4 pt-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl text-center mb-12">
          Clinicas disponível
        </h2>

        <section className=" grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="overflow-hidden p-0">
            <CardContent className="p-0">
              <div>
                <div className="relative h-48">
                  <Image
                    src={foto}
                    alt="foto da clinica"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      clinica centro
                    </h3>
                    <p className="text-sm text-gray-500">
                      Rua narnia, 10
                    </p>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                </div>

                <Link
                  href="/clinica/123"
                  className="w-full bg-gradient-to-bl from-blue-600 to-indigo-500 transition-colors duration-300 hover:from-indigo-600 hover:to-blue-500 text-white flex items-center justify-center py-2 rounded-md text-sm font-medium md:text-base"
                >
                  Agendar horario
                  <ArrowRight className="ml-2" />
                </Link>

              </div>
            </CardContent>
          </Card>
        </section>

      </div>

    </section>
  )
}