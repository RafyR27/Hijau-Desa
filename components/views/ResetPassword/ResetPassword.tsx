"use client"

import { Button } from "@/components/ui/button";
import {Check, Dot, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Controller } from "react-hook-form";
import { useResetPassword } from "./useResetPassword";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

const ResetPasswordSection = ({token}: {token: string}) => {
  const {
    control,
    handleSubmit,
    handleResetPassword,
    isPendingResetPassword,
    isSuccessResetPassword,
    isVisible,
    toggleVisibility,
    isVisibleConfirm,
    toggleVisibilityConfirm,
  } = useResetPassword(token);

  return (
    <div className="w-full min-h-screen grid grid-cols-1">
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
          <div className="space-y-1 text-center">
            <h1 className="font-bold text-[1.1rem]">Reset Password</h1>
            <p className="text-muted-foreground text-[0.9rem] lg:text-[0.9rem]">
              Silahkan masukkan Password baru.
            </p>
          </div>

          <form
            className="w-full space-y-7"
            onSubmit={handleSubmit(handleResetPassword)}
          >
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
                          type={isVisible ? "text" : "password"}
                          placeholder="Masukkan kata sandi"
                          className="px-5 "
                          disabled={
                            isPendingResetPassword || isSuccessResetPassword
                          }
                        />
                        <InputGroupAddon align="inline-end">
                          <button
                            type="button"
                            onClick={toggleVisibility}
                            className="px-1 cursor-pointer"
                          >
                            {isVisible ? (
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

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmPassword">
                    Konfirmasi Kata Sandi
                  </FieldLabel>
                  <FieldContent>
                    <InputGroup className="rounded-lg bg-background h-11 lg:h-9">
                      <InputGroupInput
                        {...field}
                        id="confirmPassword"
                        name="confirmPassword"
                        type={isVisibleConfirm ? "text" : "password"}
                        placeholder="Konfirmasi kata sandi"
                        className="px-5 "
                        disabled={
                          isPendingResetPassword || isSuccessResetPassword
                        }
                      />
                      <InputGroupAddon align="inline-end">
                        <button
                          type="button"
                          onClick={toggleVisibilityConfirm}
                          className="px-1 cursor-pointer"
                        >
                          {isVisibleConfirm ? (
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
                </Field>
              )}
            />

            <Button
              type="submit"
              className="h-11 lg:h-10 w-full rounded-full cursor-pointer"
              disabled={isPendingResetPassword || isSuccessResetPassword}
            >
              {isPendingResetPassword ? (
                <Spinner className="size-4" />
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordSection;
