"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginSection from "@/components/views/LoginSection/LoginSection";
import RegisterSection from "@/components/views/RegisterSection/RegisterSection";
import Image from "next/image";
import { useState } from "react";

const titleAuth = [
  {
    name: "login",
    title: "Selamat Datang Kembali",
    desc: "Masuk untuk kelola sampahmu dan kumpulkan poinnya.",
  },
  {
    name: "register",
    title: "Daftar Akun",
    desc: "Mulai kelola sampahmu dan kumpulkan poinnya.",
  },
];

export default function AuthLayout() {
  const [activeTab, setActiveTab] = useState("login");

  const currentAuth = titleAuth.find((item) => item.name === activeTab);

  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="/cleanup.webp"
          alt="cleanup"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-primary/70" />

        <div className="relative z-10 flex h-full flex-col justify-end p-12">
          <div className="max-w-xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-background/70">
              Hijau Desa
            </p>

            <h2 className="text-4xl font-bold leading-tight text-background">
              “Satu langkah kecil, untuk lingkungan yang lebih baik.”
            </h2>

            <p className="mt-5 text-sm leading-relaxed text-background/75">
              Mulai dari rumah, kelola sampah dengan bijak dan bersama ciptakan
              lingkungan yang lebih bersih dan nyaman.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between items-center px-5 lg:px-10 lg:h-screen lg:overflow-y-auto">
        <div className="flex justify-start w-full py-3">
          <Image
            src={"/logo-name-nobg.svg"}
            alt="hijau-desa-logo"
            width={120}
            height={120}
          />
        </div>

        <div className="w-full h-auto max-w-lg lg:max-w-sm flex flex-col justify-center items-center gap-5 py-10">
          <div className="space-y-1 text-center">
            <h1 className="font-bold text-[1.1rem]">{currentAuth?.title}</h1>
            <p className="text-muted-foreground text-[0.9rem] lg:text-[0.9rem]">
              {currentAuth?.desc}
            </p>
          </div>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full h-11! lg:h-9! rounded-lg">
              <TabsTrigger
                value="login"
                className="flex-1 h-full rounded-lg cursor-pointer data-active:bg-primary data-active:text-background data-active:font-bold data-active:hover:text-primary-foreground/40"
              >
                Masuk
              </TabsTrigger>

              <TabsTrigger
                value="register"
                className="flex-1 h-full rounded-lg cursor-pointer data-active:bg-primary data-active:text-background data-active:font-bold data-active:hover:text-primary-foreground/40"
              >
                Daftar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginSection />
            </TabsContent>

            <TabsContent value="register">
              <RegisterSection />
            </TabsContent>
          </Tabs>
        </div>

        <p className="max-w-md text-center text-muted-foreground text-[0.75rem] px-5 py-4">
          Dengan {currentAuth?.name === "login" ? "masuk" : "daftar"}, anda
          menyetujui Syarat & Ketentuan serta Kebijakan Privasi kami, dan
          bersedia menerima informasi serta pembaruan terkait layanan Hijau
          Desa.
        </p>
      </div>
    </div>
  );
}
