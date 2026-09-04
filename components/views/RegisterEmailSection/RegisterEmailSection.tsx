"use client";

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";
import { Spinner } from "@/components/ui/spinner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ArrowLeft, Check, Dot, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRegisterEmail } from "./useRegisterEmail";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const RegisterEmailSection = () => {
  const {
    showPassword,
    handleShowPassword,
    control,
    handleSubmit,
    handleRegister,
    isPendingRegister,
    isSuccessRegister,
  } = useRegisterEmail();

  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-between items-center px-5 lg:px-10">
        <div className="flex justify-start w-full py-3">
          <Image
            src={"/logo-name-nobg.svg"}
            alt="hijau-desa-logo"
            width={120}
            height={120}
          />
        </div>

        <div className="w-full h-auto max-w-lg lg:max-w-sm flex flex-col justify-center items-center gap-5 pb-10 pt-5">
          <Button
            type="button"
            variant="link"
            className="self-start flex gap-2 font-medium pb-5 px-0 active:scale-90"
            nativeButton={false}
            render={<Link href="/auth" />}
          >
            <ArrowLeft />
            Kembali
          </Button>
          <div className="space-y-1 text-center">
            <h1 className="font-bold text-[1.1rem]">Daftar Dengan Email</h1>
            <p className="text-muted-foreground text-[0.9rem] lg:text-[0.9rem]">
              Silakan isi data di bawah ini untuk membuat akun baru Anda.
            </p>
          </div>

          <form
            className="w-full space-y-7"
            onSubmit={handleSubmit(handleRegister)}
          >
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Nama Lengkap</FieldLabel>

                  <FieldContent>
                    <Input
                      {...field}
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      className="rounded-lg px-5 bg-background h-11 lg:h-9"
                      disabled={isPendingRegister || isSuccessRegister}
                    />
                  </FieldContent>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>

                  <FieldContent>
                    <Input
                      {...field}
                      id="email"
                      name="email"
                      type="text"
                      placeholder="Masukkan email"
                      className="rounded-lg px-5 bg-background h-11 lg:h-9"
                      disabled={isPendingRegister || isSuccessRegister}
                    />
                  </FieldContent>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => {
                const passwordRules = [
                  {
                    valid: field.value.length >= 8,
                    message: "Minimal 8 karakter",
                  },
                  {
                    valid: /[0-9]/.test(field.value),
                    message: "Mengandung minimal 1 angka",
                  },
                  {
                    valid: field.value.length > 0 && !/\s/.test(field.value),
                    message: "Tidak mengandung spasi",
                  },
                ];

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
                    <FieldContent>
                      <InputGroup className="rounded-lg bg-background h-11 lg:h-9">
                        <InputGroupInput
                          {...field}
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Masukkan kata sandi"
                          className="px-5 "
                          disabled={isPendingRegister || isSuccessRegister}
                        />
                        <InputGroupAddon align="inline-end">
                          <button
                            type="button"
                            onClick={handleShowPassword}
                            className="px-1 cursor-pointer"
                          >
                            {showPassword ? (
                              <EyeOff className="size-5" />
                            ) : (
                              <Eye className="size-5" />
                            )}
                          </button>
                        </InputGroupAddon>
                      </InputGroup>
                    </FieldContent>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}

                    <div className="flex flex-col gap-1 mt-2">
                      {passwordRules.map((rule) => (
                        <span
                          key={rule.message}
                          className={cn(
                            "flex items-center gap-2 text-[0.8rem]",
                            rule.valid
                              ? "text-green-500"
                              : "text-muted-foreground",
                          )}
                        >
                          {rule.valid ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Dot className="h-4 w-4" />
                          )}

                          {rule.message}
                        </span>
                      ))}
                    </div>
                  </Field>
                );
              }}
            />

            {/* Submit */}
            <Button
              type="submit"
              className="h-11 lg:h-10 w-full rounded-full cursor-pointer"
              disabled={isPendingRegister || isSuccessRegister}
            >
              {isPendingRegister || isSuccessRegister ? (
                <Spinner className="size-4" />
              ) : (
                "Daftar"
              )}
            </Button>
          </form>
        </div>

        <p className="max-w-md text-center text-muted-foreground text-[0.75rem] px-5 py-4">
          Dengan mendaftar, anda menyetujui Syarat & Ketentuan serta Kebijakan
          Privasi kami, dan bersedia menerima informasi serta pembaruan terkait
          layanan Hijau Desa.
        </p>
      </div>
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="/garbage-can.webp"
          alt="garbage-can"
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
              “Mulai langkahmu hari ini, untuk lingkungan yang lebih bersih esok
              hari.”
            </h2>

            <p className="mt-5 text-sm leading-relaxed text-background/75">
              Dari tumpukan sampah, jadi tabungan berharga.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterEmailSection;
