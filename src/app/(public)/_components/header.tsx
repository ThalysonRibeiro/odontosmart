"use client"
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { LogIn, Menu } from "lucide-react";

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const session = null;

  const navItems = [
    { href: "/proficionais", label: "Proficionais" },
    // { href: "/contatos", label: "Contatos" },
  ];

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Button
          onClick={() => setIsOpen(false)}
          key={item.href}
          className="bg-transparent hover:bg-transparent text-black shadow-none"
        >
          <Link href={item.href} className="text-base">
            {item.label}
          </Link>

        </Button>
      ))}
      {session ? (
        <Link href="/dashboard"
          className="flex items-center justify-center gap-2"
        >
          Painel da clinica
        </Link>
      ) : (
        <Button>
          Portal da clinica
          <LogIn />
        </Button>
      )}
    </>
  )

  return (
    <header className="fixed top-0 right-0 left-0 z-[999] py-4 px-6 bg-white/90">
      <div className="container mx-auto flex items-center justify-between">
        <Link
          className="text-3xl font-bold text-zinc-900"
          href="/">Odonto <span className="text-blue-500">Smart</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-4">
          <NavLinks />
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button className="text-black hover:ng-transparent"
              variant="ghost"
              size="icon"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[300px] z-[9999]">
            <SheetTitle className="mt-2 ml-2">Menu</SheetTitle>
            <SheetHeader></SheetHeader>
            <SheetDescription className="ml-2">
              Veja nossos links
            </SheetDescription>
            <nav className="flex flex-col space-y-4 mt-6 p-6">
              <NavLinks />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
} 