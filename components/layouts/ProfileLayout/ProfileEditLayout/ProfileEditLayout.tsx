"use client";

import { NavbarProfile } from "@/components/commons/Navigation/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SessionUser } from "@/types/user";
import { useProfileEdit } from "./useProfileEdit";
import { Controller } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";

export default function ProfileEditLayout({ user }: { user?: SessionUser }) {
  const {
    control,
    handleSubmit,
    isPendingUpdate,
    handleUpdate,
    isDirty,
    reset,
  } = useProfileEdit({ user });

  useEffect(() => {
    if (!user) return;

    reset({
      name: user.name ?? "",
      noRumah: user.noRumah ?? "",
      noHP: user.noHP ?? "",
    });
  }, [user, reset]);

  return (
    <div className="w-full min-h-screen relative">
      <NavbarProfile />

      <div className="w-full flex justify-center">
        <div className="px-5 pt-1 w-full lg:max-w-3xl space-y-5">
          <h2 className="font-bold text-xl text-center">Profil</h2>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src={user?.image || "https://github.com/shadcn.png"}
                alt={user?.name || "User"}
              />
              <AvatarFallback>
                {user?.name ? user.name.substring(0, 2).toUpperCase() : "CN"}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit(handleUpdate)}>
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
                    />
                  </FieldContent>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>

              <div className="flex items-center gap-2">
                <Input
                  id="email"
                  name="email"
                  value={user?.email}
                  className="rounded-lg px-5 bg-background h-11 lg:h-9"
                  disabled
                />

                <Button className="rounded-lg h-11 lg:h-9">Edit Email</Button>
              </div>
            </Field>

            <Controller
              name="noRumah"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="noRumah">Nomor Rumah</FieldLabel>

                  <Input
                    {...field}
                    id="noRumah"
                    name="noRumah"
                    placeholder="Contoh: A10 No 3"
                    className="rounded-lg px-5 bg-background h-11 lg:h-9"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="noHP"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="noHP">Nomor Handphone</FieldLabel>

                  <Input
                    {...field}
                    id="noHP"
                    name="noHP"
                    type="tel"
                    placeholder="Contoh: 081234567890"
                    autoComplete="tel"
                    className="rounded-lg px-5 bg-background h-11 lg:h-9"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              className="h-11 lg:h-10 w-full rounded-full cursor-pointer"
              disabled={!isDirty || isPendingUpdate}
            >
              {isPendingUpdate ? <Spinner className="size-4" /> : "Simpan"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
