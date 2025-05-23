import { Button } from "@/components/ui/button";
import Image from "next/image";
import doctorImg from '../../../../public/doctor-hero.png'

export function Hero() {
  return (
    <section className="bg-blue-50">
      <div className="container mx-auto px-4 pt-20 sm:px-6 lg:px-8">

        <main className="flex items-center justify-center">

          <article className="flex-[2] max-w-3xl space-y-8 flex flex-col justify-center">
            <h1 className="text-4xl lg:text-5xl font-bold max-w-2xl tracking-tight">
              Encontre os melhores profissionais em um único local!
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              Nós somos uma plataforma para profissionais da saúde com foco em agilizar seu atendimento de forma simplificada e organizada.
            </p>
            <Button className="bg-gradient-to-bl from-blue-600 to-indigo-500 transition-colors duration-300  hover:from-indigo-600 hover:to-blue-500 w-fit px-6 font-semibold">
              Encontre uma clinica
            </Button>
          </article>

          <div className="hidden lg:block">
            <Image
              src={doctorImg}
              alt="foto ilustrativa profisional da saude"
              width={340}
              height={400}
              quality={100}
              priority
              className="object-contain"
            />
          </div>

        </main>

      </div>
    </section>
  )
}