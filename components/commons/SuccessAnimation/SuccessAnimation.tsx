"use client";

import { Lottie } from "lottie-react";

export function SuccessAnimationPenimbangan() {
  return (
    <Lottie
      src="/animations/success-bag.json"
      loop={false}
      autoplay={true}
      style={{ height: 200 }}
    />
  );
}

export function SuccessAnimationPenukaran() {
  return (
    <Lottie
      src="/animations/order-packed.json"
      loop={false}
      autoplay={true}
      style={{
        height: 200,
        transform: "scale(1.5)",
      }}
    />
  );
}
