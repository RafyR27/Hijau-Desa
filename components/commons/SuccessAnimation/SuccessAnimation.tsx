"use client";

import { Lottie } from "lottie-react";

export default function SuccessAnimation() {
  return (
    <Lottie
      src="/animations/success-bag.json"
      loop={false}
      autoplay={true}
      style={{ height: 200 }}
    />
  );
}
