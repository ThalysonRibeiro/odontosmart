"use client"
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import clsx from "clsx";
import { Banknote, BarChart, CalendarCheck2, ChevronLeft, ChevronRight, FileText, Folder, List, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"
import { useState } from "react";
import logoImg from '../../../../../public/logo-odonto.png'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"



export function SidebarDashboard({ children, }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className='flex min-h-screen w-full'>

      <aside
        className={clsx("flex flex-col border-r bg-background transition-all duration-300 p-4 h-full", {
          "w-20": isCollapsed,
          "w-64": !isCollapsed,
          "hidden md:flex md:fixed": true
        })}
      >
        {!isCollapsed && (
          <div className="mb-6 mt-4">
            <Image
              src={logoImg}
              alt="logo do odonto smart"
              priority
              quality={100}
            // style={{
            //   width: 'auto',
            //   height: 'auto',
            // }}
            />
          </div>
        )}

        <Button className="bg-gray-100 hover:bg-gray-50 text-zinc-900 self-end mb-2"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {!isCollapsed ? <ChevronLeft className="w-12 h-12" /> : <ChevronRight className="w-12 h-12" />}
        </Button>

        {isCollapsed && (
          <nav className="flex flex-col gap-1 overflow-hidden mt-2">
            <SideBarLink
              href="/dashboard"
              label="Agendamentos"
              pathname={pathname}
              isCollapsed={isCollapsed}
              icon={<CalendarCheck2 className="w-6 h-6" />}
            />
            <SideBarLink
              href="/dashboard/services"
              label="Serviços"
              pathname={pathname}
              isCollapsed={isCollapsed}
              icon={<Folder className="w-6 h-6" />}
            />
            <SideBarLink
              href="/dashboard/reports"
              label="Relatorios"
              pathname={pathname}
              isCollapsed={isCollapsed}
              icon={<FileText className="w-6 h-6" />}
            />
            <SideBarLink
              href="/dashboard/profile"
              label="Meu perfil"
              pathname={pathname}
              isCollapsed={isCollapsed}
              icon={<Settings className="w-6 h-6" />}
            />
            <SideBarLink
              href="/dashboard/plans"
              label="Planos"
              pathname={pathname}
              isCollapsed={isCollapsed}
              icon={<Banknote className="w-6 h-6" />}
            />
          </nav>
        )}

        <Collapsible open={!isCollapsed}>
          <CollapsibleContent>
            <nav className="flex flex-col gap-1 overflow-hidden">
              <span className="text-sm text-gray-400 font-medium mt-1 uppercase">
                painel
              </span>
              <SideBarLink
                href="/dashboard"
                label="Agendamentos"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<CalendarCheck2 className="w-6 h-6" />}
              />
              <SideBarLink
                href="/dashboard/services"
                label="Serviços"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<Folder className="w-6 h-6" />}
              />
              <SideBarLink
                href="/dashboard/reports"
                label="Relatorios"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<FileText className="w-6 h-6" />}
              />

              <span className="text-sm text-gray-400 font-medium mt-1 uppercase">
                configuações
              </span>
              <SideBarLink
                href="/dashboard/profile"
                label="Meu perfil"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<Settings className="w-6 h-6" />}
              />
              <SideBarLink
                href="/dashboard/plans"
                label="Planos"
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={<Banknote className="w-6 h-6" />}
              />
            </nav>
          </CollapsibleContent>
        </Collapsible>

      </aside>

      <div className={clsx("flex flex-1 flex-col transition-all duration-300", {
        "md:ml-20": isCollapsed,
        "md:ml-64": !isCollapsed
      })}>


        <header className="md:hidden flex items-center justify-between border-b px-2 md:px-6 h-14 z-10 sticky top-0 bg-white/90">
          <Sheet>
            <div className='flex items-center gap-4'>
              <SheetTrigger asChild>
                <Button
                  onClick={() => setIsCollapsed(false)}
                  variant="outline"
                  size="icon"
                  className='md:hidden'>
                  <List className='w-5 h-5' />
                </Button>
              </SheetTrigger>

              <h1 className="text-base md:text-lg font-extrabold">Menu Odonto Smart</h1>
            </div>

            <SheetContent side="right" className="sm:max-w-xs text-black p-6">
              <SheetTitle>Odonto Smart</SheetTitle>
              <SheetDescription>
                Menu adminstrativo
              </SheetDescription>
              <nav className="grid gap-2 text-base pt-5">
                <SideBarLink
                  href="/dashboard"
                  label="Agendamentos"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  icon={<CalendarCheck2 className="w-6 h-6" />}
                />
                <SideBarLink
                  href="/dashboard/services"
                  label="Serviços"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  icon={<Folder className="w-6 h-6" />}
                />
                <SideBarLink
                  href="/dashboard/reports"
                  label="Relatorios"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  icon={<FileText className="w-6 h-6" />}
                />
                <SideBarLink
                  href="/dashboard/profile"
                  label="Meu perfil"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  icon={<Settings className="w-6 h-6" />}
                />
                <SideBarLink
                  href="/dashboard/plans"
                  label="Planos"
                  pathname={pathname}
                  isCollapsed={isCollapsed}
                  icon={<Banknote className="w-6 h-6" />}
                />
              </nav>
            </SheetContent>
          </Sheet>
        </header>


        <main className='flex-1 py-4 px-2 md:p-6'>
          {children}
        </main>
      </div>
    </div>
  )
}

interface SideBarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  pathname: string;
  isCollapsed: boolean;
}

function SideBarLink({ href, icon, isCollapsed, label, pathname }: SideBarLinkProps) {
  return (
    <Link
      href={href}
    >
      <div className={clsx("flex items-center gap-2 px-3 py-2 rounded-md transition-colors", {
        "text-white bg-blue-500": pathname === href,
        "text-gray-600 hover:bg-gray-100": pathname !== href,
      })}>
        <span className="w-6 h-6">{icon}</span>
        {!isCollapsed && <span>{label}</span>}
      </div>

    </Link>
  )
}
