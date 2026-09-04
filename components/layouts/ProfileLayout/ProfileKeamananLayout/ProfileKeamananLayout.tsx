"use client";

import { NavbarProfile } from "@/components/commons/Navigation/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { formatDateVerif } from "@/lib/formated";
import { SessionUser } from "@/types/user";
import {
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Controller } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { useProfileKeamanan } from "./useProfileKeamanan";

export default function ProfileKeamananLayout({
  user,
}: {
  user?: SessionUser;
}) {
  const {
    control,
    handleSubmit,
    handleSetPassword,
    handleResetPassword,
    isPendingSetPassword,
    isPendingResetPassword,
    isLoadingSecurity,
    securityData,
    isDirty,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isSuccessResetPassword,
  } = useProfileKeamanan({ user });

  const hasPassword = securityData?.hasPassword ?? false;
  const isGoogle = securityData?.loginMethods?.includes("google") ?? false;
  const isCredential =
    securityData?.loginMethods?.includes("credential") ?? false;

  return (
    <div className="w-full min-h-screen relative pb-10">
      <NavbarProfile />

      <div className="w-full flex justify-center">
        <div className="px-5 pt-1 w-full lg:max-w-3xl space-y-7">
          <div className="text-center space-y-1">
            <h2 className="font-bold text-xl lg:text-2xl">Keamanan Akun</h2>
          </div>

          {/* Status Keamanan & Metode Login */}
          <Card className="ring-0 p-0">
            <CardHeader className="p-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5" />
                <CardTitle className="text-base font-semibold">
                  Status & Metode Masuk
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 p-0">
              {isLoadingSecurity ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full rounded-lg" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Metode Login */}
                  <div className="p-4 rounded-xl bg-muted/40 border flex flex-col justify-between gap-3">
                    <div>
                      <span className="text-xs text-muted-foreground font-medium">
                        Metode Login Terhubung
                      </span>
                      <div className="mt-2 flex flex-wrap gap-2 items-center">
                        {isGoogle && (
                          <Badge
                            variant="outline"
                            className="bg-background px-3 py-1 gap-2 text-xs font-semibold shadow-xs"
                          >
                            <FcGoogle className="size-4" />
                            Google
                          </Badge>
                        )}
                        {isCredential && (
                          <Badge
                            variant="outline"
                            className="bg-background px-3 py-1 gap-2 text-xs font-semibold shadow-xs"
                          >
                            <KeyRound className="size-3.5 text-primary" />
                            Email & Kata Sandi
                          </Badge>
                        )}
                        {!isGoogle && !isCredential && (
                          <Badge variant="outline" className="bg-background">
                            Email
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Kapan Password Diubah */}
                  <div className="p-4 rounded-xl bg-muted/40 border flex flex-col justify-between gap-3">
                    <div>
                      <span className="text-xs text-muted-foreground font-medium">
                        Kata Sandi Terakhir Diubah
                      </span>
                      <div className="mt-2 flex items-center gap-2">
                        <Clock className="size-4 text-muted-foreground shrink-0" />
                        <span className="text-sm font-medium">
                          {hasPassword && securityData?.passwordUpdatedAt
                            ? formatDateVerif(
                                new Date(securityData.passwordUpdatedAt),
                              )
                            : hasPassword
                              ? "Sudah diatur"
                              : "Belum pernah diatur"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dynamic Actions */}
          {!isLoadingSecurity && (
            <>
              {hasPassword ? (
                /* Case 1: Pengguna memiliki kata sandi (login via credential / password sudah dibuat) */
                <Card className="ring-0 p-0">
                  <CardHeader className="p-0">
                    <div className="flex items-center gap-2">
                      <KeyRound className="size-5" />
                      <CardTitle className="text-base font-semibold">
                        Atur Ulang Kata Sandi
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Kirimkan tautan reset kata sandi ke alamat email Anda
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-5 p-0">
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3 text-sm">
                      <Mail className="size-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">
                          Instruksi reset akan dikirim ke:
                        </p>
                        <p className="font-semibold text-primary mt-0.5">
                          {user?.email || securityData?.email}
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={
                        isPendingResetPassword || isSuccessResetPassword
                      }
                      className="w-full h-11 lg:h-10 rounded-full cursor-pointer gap-2 font-medium mt-5"
                    >
                      {isPendingResetPassword ? (
                        <>
                          <Spinner className="size-4" />
                        </>
                      ) : (
                        <>
                          <Mail className="size-4" />
                          <span>Kirim Tautan Reset Kata Sandi</span>
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="ring-0">
                  <CardHeader className="p-0">
                    <div className="flex items-center gap-2">
                      <Lock className="size-5" />
                      <CardTitle className="text-base font-semibold">
                        Buat Kata Sandi Akun
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Buat kata sandi agar Anda dapat masuk juga menggunakan
                      email dan kata sandi mandiri
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-0">
                    <form
                      onSubmit={handleSubmit(handleSetPassword)}
                      className="space-y-5"
                    >
                      {/* Password Baru */}
                      <Controller
                        name="password"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="password">
                              Kata Sandi Baru
                            </FieldLabel>

                            <FieldContent>
                              <InputGroup className="rounded-lg bg-background h-11 lg:h-9">
                                <InputGroupInput
                                  {...field}
                                  id="password"
                                  name="password"
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Minimal 8 karakter"
                                  className="px-4"
                                  disabled={isPendingSetPassword}
                                />
                                <InputGroupAddon align="inline-end">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                    className="px-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                  >
                                    {showPassword ? (
                                      <EyeOff className="size-4" />
                                    ) : (
                                      <Eye className="size-4" />
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

                      {/* Konfirmasi Password */}
                      <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="confirmPassword">
                              Konfirmasi Kata Sandi Baru
                            </FieldLabel>

                            <FieldContent>
                              <InputGroup className="rounded-lg bg-background h-11 lg:h-9">
                                <InputGroupInput
                                  {...field}
                                  id="confirmPassword"
                                  name="confirmPassword"
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  placeholder="Ulangi kata sandi baru"
                                  className="px-4"
                                  disabled={isPendingSetPassword}
                                />
                                <InputGroupAddon align="inline-end">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowConfirmPassword(
                                        !showConfirmPassword,
                                      )
                                    }
                                    className="px-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                  >
                                    {showConfirmPassword ? (
                                      <EyeOff className="size-4" />
                                    ) : (
                                      <Eye className="size-4" />
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

                      {/* Syarat Password */}
                      <div className="p-3.5 rounded-xl bg-muted/40 border space-y-1.5 text-xs text-muted-foreground">
                        <p className="font-semibold text-foreground flex items-center gap-1.5">
                          <CheckCircle2 className="size-3.5 text-primary" />
                          Syarat Kata Sandi:
                        </p>
                        <ul className="list-disc list-inside space-y-1 pl-1">
                          <li>Minimal 8 karakter</li>
                          <li>Mengandung minimal 1 angka (0-9)</li>
                          <li>Tidak mengandung spasi</li>
                        </ul>
                      </div>

                      {/* Submit */}
                      <Button
                        type="submit"
                        disabled={!isDirty || isPendingSetPassword}
                        className="w-full h-11 lg:h-10 rounded-full cursor-pointer font-medium"
                      >
                        {isPendingSetPassword ? (
                          <>
                            <Spinner className="size-4 mr-2" />
                            <span>Menyimpan Kata Sandi...</span>
                          </>
                        ) : (
                          "Simpan Kata Sandi"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
