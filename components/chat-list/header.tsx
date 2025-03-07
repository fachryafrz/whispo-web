"use client";

import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { EllipsisVertical, Moon, Settings, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Skeleton } from "@heroui/skeleton";
import { addToast } from "@heroui/toast";
import { Tooltip } from "@heroui/tooltip";

import Logo from "../logo";

import { siteConfig } from "@/config/site";
import { useStoreUserEffect } from "@/hooks/use-store-user";

export default function ChatListHeader() {
  useStoreUserEffect();
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
      <Tooltip content={siteConfig.name} placement="bottom">
        <div className="justify-self-center">
          <Logo height={40} />

          <h1 className={`sr-only`}>{siteConfig.name}</h1>
        </div>
      </Tooltip>

      {/* CTA */}
      {mounted && (
        <div className={`justify-self-end`}>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly radius="full" variant="light">
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
              <DropdownItem
                key="settings"
                onPress={() =>
                  addToast({
                    title: "Settings",
                    description:
                      "Configure settings. This feature is coming soon.",
                    color: "warning",
                  })
                }
              >
                <div className={`flex items-center gap-2`}>
                  <Settings />
                  <span>Settings</span>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      )}
    </header>
  );
}
