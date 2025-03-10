"use client";

import { useEffect } from "react";
import { Button } from "@heroui/button";

import Logo from "@/components/logo";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    /* eslint-disable no-console */
    console.error(error);
  }, [error]);

  return (
    <div
      className={`absolute inset-0 z-10 flex h-dvh flex-1 flex-col items-center justify-center gap-4 bg-black md:static`}
    >
      <Logo width={80} />
      <h2 className={`text-2xl font-bold`}>Something went wrong!</h2>
      <Button
        onPress={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
