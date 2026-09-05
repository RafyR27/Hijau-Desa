"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname()
  const isHome = path === "/";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-20 w-full items-center justify-between px-5 md:px-20">
          <Link href="/" className="shrink-0">
            <Image
              src="/logo-name-nobg.svg"
              alt="Hijau Desa"
              width={120}
              height={120}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-10 text-sm font-medium lg:flex">
            <Link
              href={isHome ? "#home" : "/#home"}
              className="transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href={isHome ? "#tentang" : "/#tentang"}
              className="transition-colors hover:text-primary"
            >
              Tentang Kita
            </Link>
            <Link
              href={isHome ? "#cara-kerja" : "/#cara-kerja"}
              className="transition-colors hover:text-primary"
            >
              Cara Kerja
            </Link>
            <Link
              href={isHome ? "#manfaat" : "/#manfaat"}
              className="transition-colors hover:text-primary"
            >
              Manfaat
            </Link>
          </nav>

          <div className="hidden lg:flex items-center">
            <Link href="/auth">
              <Button className="px-6 font-semibold cursor-pointer">
                Coba Sekarang
              </Button>
            </Link>
          </div>

          {/* Mobile Header Buttons */}
          <div className="flex items-center gap-3 lg:hidden">
            <Link href="/auth">
              <Button size="sm" className="text-xs px-3 font-semibold">
                Coba
              </Button>
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="p-2 rounded-xl text-foreground hover:bg-muted transition-colors focus:outline-none cursor-pointer"
              aria-label="Buka menu navigasi"
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Navigation Menu (Overlay outside header to avoid stacking context clipping) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background lg:hidden flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
          {/* Mobile Menu Top Bar */}
          <div className="flex h-20 items-center justify-between px-5 border-b border-border/50 shrink-0">
            <Link href="/" onClick={closeMenu}>
              <Image
                src="/logo-name-nobg.svg"
                alt="Hijau Desa"
                width={120}
                height={120}
                priority
              />
            </Link>

            <button
              type="button"
              onClick={closeMenu}
              className="p-2 rounded-xl text-foreground hover:bg-muted transition-colors focus:outline-none cursor-pointer"
              aria-label="Tutup menu navigasi"
            >
              <X className="size-6" />
            </button>
          </div>

          {/* Categorized Menu Content (Matching Reference Image) */}
          <div className="px-7 py-8 space-y-8 flex-1 overflow-y-auto">
            {/* Category 1: Menu */}
            <div className="space-y-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Menu
              </p>
              <div className="flex flex-col space-y-4">
                <Link
                  href={isHome ? "#home" : "/#home"}
                  onClick={closeMenu}
                  className="text-2xl font-bold tracking-tight text-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
                <Link
                  href={isHome ? "#tentang" : "/#tentang"}
                  onClick={closeMenu}
                  className="text-2xl font-bold tracking-tight text-foreground hover:text-primary transition-colors"
                >
                  Tentang Kami
                </Link>
                <Link
                  href={isHome ? "#cara-kerja" : "/#cara-kerja"}
                  onClick={closeMenu}
                  className="text-2xl font-bold tracking-tight text-foreground hover:text-primary transition-colors"
                >
                  Cara Kerja
                </Link>
                <Link
                  href={isHome ? "#manfaat" : "/#manfaat"}
                  onClick={closeMenu}
                  className="text-2xl font-bold tracking-tight text-foreground hover:text-primary transition-colors"
                >
                  Manfaat
                </Link>
              </div>
            </div>

            <div className="pt-4 pb-8">
              <Link href="/auth" onClick={closeMenu} className="w-full block">
                <Button className="w-full py-6 text-base font-semibold shadow-lg cursor-pointer">
                  Mulai Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <main className="flex flex-col min-h-screen">{children}</main>

      <footer className="bg-primary text-white">
        <div className="mx-auto w-full px-5 py-10 md:px-20">
          <div className="grid gap-10 md:gap-20 md:grid-cols-3">
            <div>
              <Image
                src="/logo-name.svg"
                alt="Hijau Desa"
                width={150}
                height={150}
              />
              <p className="mt-6 max-w-sm text-sm leading-6 text-white/80">
                Bersama Hijau Desa, kita wujudkan lingkungan yang lebih bersih
                sekaligus memberikan nilai dari setiap sampah yang kita kelola.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold"> Navigasi </h3>
              <nav className="flex flex-col gap-3 text-sm text-white/80">
                <Link
                  href="#home"
                  className="transition-colors hover:text-white"
                >
                  Home
                </Link>
                <Link
                  href="#tentang"
                  className="transition-colors hover:text-white"
                >
                  Tentang Kita
                </Link>
                <Link
                  href="#manfaat"
                  className="transition-colors hover:text-white"
                >
                  Manfaat
                </Link>
              </nav>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Mulai Bersama Hijau Desa</h3>
              <p className="mb-5 text-sm leading-6 text-white/80">
                Kelola sampahmu, dapatkan poin, dan ikut berkontribusi menjaga
                lingkungan.
              </p>
              <Link href="/auth">
                <Button
                  variant="secondary"
                  className="px-6 text-background font-semibold cursor-pointer"
                >
                  Coba Sekarang
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-12 border-t border-white/20 pt-6 text-center text-sm text-white/60">
            © 2026 Hijau Desa. Semua hak dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
}
