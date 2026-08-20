"use client";

import { Button } from "@/components/ui/button";

import { FcGoogle } from "react-icons/fc";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const RegisterSection = () => {
  

  return (
    <div>
      <div className="my-6 relative">
        <Button
          type="button"
          variant={"outline"}
          className="w-full h-10 rounded-lg text-sm font-medium flex gap-3 cursor-pointer border-primary/50 border-2"
        >
          <FcGoogle />
          Daftar dengan Google
        </Button>
        <Badge className="font-bold absolute -top-2 right-0">Disarankan</Badge>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>

        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-muted-foreground">
            Atau daftar dengan Email
          </span>
        </div>
      </div>

      <div className="my-6">
        <Button
          variant={"outline"}
          nativeButton={false}
          className="w-full h-10 rounded-lg text-sm font-medium flex gap-3 cursor-pointer "
          render={<Link href="/auth/register-email" />}
        >
          Daftar dengan Email
        </Button>
      </div>

      
    </div>
  );
};

export default RegisterSection;
