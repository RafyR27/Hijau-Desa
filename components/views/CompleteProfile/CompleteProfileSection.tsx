"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SessionUser } from "@/types/user";
import { Control, Controller, UseFormHandleSubmit } from "react-hook-form";
import { formCompleteProfileSchema, useCompleteProfile } from "./useCompleteProfile";
import * as z from "zod";
import { Spinner } from "@/components/ui/spinner";

const WelcomeView = ({
  user,
  onNext,
}: {
  user?: SessionUser;
  onNext: () => void;
}) => {
  return (
    <div className="flex h-screen w-full shrink-0 flex-col justify-between py-8">
      <div className="w-full max-w-2xl space-y-6 md:pt-10">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase text-muted-foreground truncate">
            Hii, {user?.name}
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Selamat Datang di Hijau Desa
          </h1>
        </div>

        <div className="space-y-4 text-[0.95rem] leading-7 text-muted-foreground md:text-base">
          <p>
            Terima kasih telah menjadi bagian dari Hijau Desa. Bersama-sama,
            mari kita mulai kebiasaan baru untuk menjaga kebersihan dan
            kelestarian lingkungan di sekitar kita.
          </p>

          <p>
            Sebelum mulai menggunakan layanan Hijau Desa, lengkapi terlebih
            dahulu beberapa informasi agar kami dapat memberikan layanan yang
            sesuai untuk Anda.
          </p>
        </div>
      </div>

      <Button
        type="button"
        variant="link"
        onClick={onNext}
        className="self-end gap-2 px-0 pb-2 text-base font-semibold"
      >
        Selanjutnya
        <ArrowRight className="size-5" />
      </Button>
    </div>
  );
};

const InputView = ({
  control,
  onNext,
  onBack,
  handleSubmit,
}: {
  control: Control<z.infer<typeof formCompleteProfileSchema>>;
  handleSubmit: UseFormHandleSubmit<z.infer<typeof formCompleteProfileSchema>>;
  onNext: () => void;
  onBack: () => void;
}) => {
  return (
    <div className="flex h-screen w-full shrink-0 flex-col justify-between py-8">
      <div className="w-full max-w-2xl space-y-6 md:pt-10">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase text-muted-foreground">
            Langkah 1
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Lengkapi Informasi
          </h1>

          <p className="text-muted-foreground">
            Lengkapi informasi berikut untuk melanjutkan.
          </p>
        </div>

        {/* Form */}
        <FieldGroup>
          <Controller
            name="noRumah"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="px-1">
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

                <FieldDescription>Masukkan nomor rumah anda.</FieldDescription>
              </Field>
            )}
          />

          <Controller
            name="noHP"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="px-1">
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

                <FieldDescription>
                  Nomor yang dapat digunakan untuk menghubungi anda.
                </FieldDescription>
              </Field>
            )}
          />
        </FieldGroup>
      </div>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="link"
          onClick={onBack}
          className="gap-2 px-0 pb-2 text-base font-semibold"
        >
          <ArrowLeft className="size-5" />
          Kembali
        </Button>

        <Button
          type="button"
          variant="link"
          onClick={handleSubmit(() => onNext())}
          className="gap-2 px-0 pb-2 text-base font-semibold"
        >
          Selanjutnya
          <ArrowRight className="size-5" />
        </Button>
      </div>
    </div>
  );
};

const AgreementView = ({
  handleSubmit,
  handleUpdate,
  isPendingUpdate,
  onBack,
}: {
  handleSubmit: UseFormHandleSubmit<z.infer<typeof formCompleteProfileSchema>>;
  handleUpdate: (data: z.infer<typeof formCompleteProfileSchema>) => void;
  isPendingUpdate: boolean;
  onBack: () => void;
}) => {
  const [agree, setAgree] = useState(false);

  return (
    <div className="flex h-screen w-full shrink-0 flex-col py-8">
      {/* Header */}
      <div className="w-full max-w-2xl shrink-0 md:pt-10">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase text-muted-foreground">
            Langkah 2
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Persetujuan
          </h1>

          <p className="text-muted-foreground">
            Baca dan setujui ketentuan sebelum menggunakan Hijau Desa.
          </p>
        </div>
      </div>

      {/* Agreement */}
      <div className="my-6 min-h-0 flex-1 overflow-y-auto md:overflow-visible">
        <div className="space-y-5">
          <div className="flex gap-3">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />

            <p className="text-sm leading-6 text-muted-foreground">
              Kami diperbolehkan menyimpan informasi Anda, seperti nama, email,
              nomor handphone, dan nomor rumah, untuk keperluan verifikasi
              identitas oleh pengurus RW atau kepala desa.
            </p>
          </div>

          <div className="flex gap-3">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />

            <p className="text-sm leading-6 text-muted-foreground">
              Kami diperbolehkan mengirimkan email kepada Anda untuk
              menyampaikan informasi, pemberitahuan, dan layanan yang berkaitan
              dengan Hijau Desa.
            </p>
          </div>

          <div className="flex gap-3">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />

            <p className="text-sm leading-6 text-muted-foreground">
              Untuk pemilik warung dan petugas, aplikasi dapat meminta akses
              kamera untuk fitur pemindaian QR. Kamera hanya digunakan ketika
              fitur pemindaian QR dijalankan dan setelah Anda memberikan izin
              melalui browser.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <form
        onSubmit={handleSubmit(handleUpdate)}
        className="shrink-0 bg-background"
      >
        <div className="flex items-center gap-3 rounded-lg border p-4">
          <Checkbox
            id="agreement"
            checked={agree}
            onCheckedChange={(checked) => setAgree(checked === true)}
          />

          <Label
            htmlFor="agreement"
            className="cursor-pointer text-sm font-normal leading-6"
          >
            Saya telah membaca, memahami, dan menyetujui penggunaan data serta
            akses fitur sebagaimana dijelaskan di atas.
          </Label>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Button
            type="button"
            variant="link"
            onClick={onBack}
            className="gap-2 px-0 pb-2 text-base font-semibold"
          >
            <ArrowLeft className="size-5" />
            Kembali
          </Button>

          <Button
            type="submit"
            disabled={!agree || isPendingUpdate}
            className="px-8"
          >
            {isPendingUpdate ? <Spinner className="size-4" /> : "Selesai"}
          </Button>
        </div>
      </form>
    </div>
  );
};

const CompleteProfileSection = ({ user }: { user?: SessionUser }) => {
  const { control, handleSubmit, handleUpdate, isPendingUpdate } =
    useCompleteProfile();
  const [step, setStep] = useState(0);

  return (
    <div className="w-full overflow-hidden">
      <div
        className="flex w-full transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${step * 100}%)`,
        }}
      >
        <WelcomeView user={user} onNext={() => setStep(1)} />

        <InputView
          control={control}
          handleSubmit={handleSubmit}
          onNext={() => setStep(2)}
          onBack={() => setStep(0)}
        />

        <AgreementView
          handleSubmit={handleSubmit}
          handleUpdate={handleUpdate}
          isPendingUpdate={isPendingUpdate}
          onBack={() => setStep(1)}
        />
      </div>
    </div>
  );
};

export default CompleteProfileSection;
