"use client";

import { NavbarProfile } from "@/components/commons/Navigation/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SessionUser } from "@/types/user";
import { useEditEmail } from "./useEditEmail";
import { Controller } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";

export default function EditEmailLayout({ user }: { user?: SessionUser }) {
  const {
    control,
    handleSubmit,
    isPendingUpdate,
    handleUpdateEmail,
    isDirty,
    isSameEmail,
  } = useEditEmail({ user });

  return (
    <div className="w-full min-h-screen relative">
      <NavbarProfile />

      <div className="w-full flex justify-center">
        <div className="px-5 pt-1 w-full lg:max-w-3xl space-y-5">
          <h2 className="font-bold text-xl text-center">Ubah Email</h2>

          {/* Current Email */}
          <Field>
            <FieldLabel htmlFor="currentEmail">Email Saat Ini</FieldLabel>

            <FieldContent>
              <Input
                id="currentEmail"
                name="currentEmail"
                value={user?.email ?? ""}
                className="rounded-lg px-5 bg-background h-11 lg:h-9"
                disabled
              />
            </FieldContent>
          </Field>

          {/* Form */}
          <form
            className="space-y-5"
            onSubmit={handleSubmit(handleUpdateEmail)}
          >
            <Controller
              name="newEmail"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="newEmail">Email Baru</FieldLabel>

                  <FieldContent>
                    <Input
                      {...field}
                      id="newEmail"
                      name="newEmail"
                      type="email"
                      placeholder="Masukkan email baru"
                      autoComplete="email"
                      className="rounded-lg px-5 bg-background h-11 lg:h-9"
                    />

                    <FieldDescription>
                      Masukkan alamat email baru yang ingin Anda gunakan.
                    </FieldDescription>
                  </FieldContent>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}

                  {isSameEmail && !fieldState.invalid && (
                    <p className="text-sm text-destructive">
                      Email baru tidak boleh sama dengan email saat ini
                    </p>
                  )}
                </Field>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              className="h-11 lg:h-10 w-full rounded-full cursor-pointer"
              disabled={!isDirty || isSameEmail || isPendingUpdate}
            >
              {isPendingUpdate ? (
                <Spinner className="size-4" />
              ) : (
                "Simpan Email Baru"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
