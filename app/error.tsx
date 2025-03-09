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
    <div className={`flex h-dvh flex-col items-center justify-center gap-4`}>
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
