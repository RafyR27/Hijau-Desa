"use client"

import Image from "next/image"

export default function LoadingScreen () {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-primary">
        <Image
          src={"/logo-name.svg"}
          alt="hijau-desa-logo"
          width={230}
          height={230}
          className="animate-pulse"
        />
      </div>
    );
}