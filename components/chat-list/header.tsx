"use client";

import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { EllipsisVertical, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Skeleton } from "@heroui/skeleton";

import { siteConfig } from "@/config/site";

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const onChange = () => {
    resolvedTheme === "light" ? setTheme("dark") : setTheme("light");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className={`grid grid-cols-3 items-center p-4`}>
      {/* User */}

      <ClerkLoading>
        <Skeleton className="flex h-10 w-10 justify-self-start rounded-full" />
      </ClerkLoading>

      <ClerkLoaded>
        <UserButton />
      </ClerkLoaded>

      {/* App Name */}
      <h1 className={`justify-self-center text-xl font-bold`}>
        {siteConfig.name}
      </h1>

      {/* CTA */}
      {mounted && (
        <div className={`justify-self-end`}>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly variant="light">
                <EllipsisVertical />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Menu">
              <DropdownItem key="toggle-theme" onPress={onChange}>
                <div className={`flex items-center gap-2`}>
                  {resolvedTheme === "light" ? <Moon /> : <Sun />}
                  <span>
                    {resolvedTheme === "light" ? "Dark Mode" : "Light Mode"}
                  </span>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      )}
    </header>
  );
}
