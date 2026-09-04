"use client"

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForgotPassword } from "./useForgotPassword";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Controller } from "react-hook-form";

const ForgotPasswordSection = () => {
  const {
    control,
    handleSubmit,
    handleForgotPassword,
    isPendingForgotPassword,
    isSuccessForgotPassword,
  } = useForgotPassword();

  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center px-5  lg:px-10 relative">
        <div className="flex justify-start w-full p-3 lg:px-10 absolute top-0 left-0">
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
            <h1 className="font-bold text-[1.1rem]">Lupa Password</h1>
            <p className="text-muted-foreground text-[0.9rem] lg:text-[0.9rem]">
              Silahkan masukkan email yang terdaftar.
            </p>
          </div>

          <form
            className="w-full space-y-7"
            onSubmit={handleSubmit(handleForgotPassword)}
          >
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
                      disabled={
                        isPendingForgotPassword || isSuccessForgotPassword
                      }
                    />
                  </FieldContent>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              className="h-11 lg:h-10 w-full rounded-full cursor-pointer"
              disabled={isPendingForgotPassword || isSuccessForgotPassword}
            >
              {isPendingForgotPassword ? (
                <Spinner className="size-4" />
              ) : (
                "Kirim Link Reset Password"
              )}
            </Button>
          </form>
        </div>
      </div>
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="/garbage-can2.webp"
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
              “Lupa password bukan berarti harus berhenti melangkah.”
            </h2>

            <p className="mt-5 text-sm leading-relaxed text-background/75">
              Dapatkan kembali akses ke akunmu dan lanjutkan langkahmu bersama
              Hijau Desa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordSection;
