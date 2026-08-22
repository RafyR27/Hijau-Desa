import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useLogin } from "./useLogin";
import Link from "next/link";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { FcGoogle } from "react-icons/fc";
import { Badge } from "@/components/ui/badge";
import { Controller } from "react-hook-form";
import { Spinner } from "@/components/ui/spinner";

const LoginSection = () => {
  const {
    handleShowPassword,
    showPassword,
    isPendingLogin,
    control,
    handleLogin,
    handleSubmit,
  } = useLogin();

  return (
    <div>
      <div className="my-6 relative">
        <Button
          type="button"
          variant={"outline"}
          className="w-full h-10 rounded-lg text-sm font-medium flex gap-3 cursor-pointer border-primary/50 border-2"
        >
          <FcGoogle />
          Masuk dengan Google
        </Button>
        <Badge className="font-bold absolute -top-2 right-0">Disarankan</Badge>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>

        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-muted-foreground">
            Atau masuk dengan Email
          </span>
        </div>
      </div>

      <form
        className="w-full space-y-7 py-5"
        onSubmit={handleSubmit(handleLogin)}
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
                />
              </FieldContent>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>

                <Link
                  href={"/"}
                  className="text-primary hover:underline text-[0.8rem]"
                >
                  Lupa Kata Sandi?
                </Link>
              </div>

              <FieldContent>
                <InputGroup className="rounded-lg bg-background h-11 lg:h-9">
                  <InputGroupInput
                    {...field}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan kata sandi"
                    className="px-5 "
                  />
                  <InputGroupAddon align="inline-end">
                    <button
                      type="button"
                      onClick={handleShowPassword}
                      className="px-1"
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

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Submit */}
        <Button
          type="submit"
          className="h-11 lg:h-10 w-full rounded-full cursor-pointer"
          disabled={isPendingLogin}
        >
          {isPendingLogin ? <Spinner className="size-4" /> : "Masuk"}
        </Button>
      </form>
    </div>
  );
};

export default LoginSection;
