"use client";

import { CircleProvider } from "@/context/CircleContext";
import { CircleRollApp } from "@/components/CircleRollApp";

export default function Home() {
  return (
    <CircleProvider>
      <CircleRollApp />
    </CircleProvider>
  );
}
