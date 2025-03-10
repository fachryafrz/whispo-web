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
import { Skeleton } from "@heroui/skeleton";
import { addToast } from "@heroui/toast";
import { Tooltip } from "@heroui/tooltip";
import Link from "next/link";

import Logo from "../logo";

import { siteConfig } from "@/config/site";

export default function ChatListHeader() {
  const { resolvedTheme, setTheme } = useTheme();

  const onChange = () => {
    resolvedTheme === "light" ? setTheme("dark") : setTheme("light");
  };

  return (
    <header className={`grid grid-cols-3 items-center p-4`}>
      {/* CTA */}
      <div className={`justify-self-start`}>
        <Dropdown placement="bottom-start">
          <DropdownTrigger>
            <Button isIconOnly radius="full" variant="light">
              <EllipsisVertical />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Menu">
            {/* Toggle theme */}
            <DropdownItem
              key="toggle-theme"
              startContent={
                resolvedTheme === "light" ? (
                  <Moon size={20} />
                ) : (
                  <Sun size={20} />
                )
              }
              onPress={onChange}
            >
              {resolvedTheme === "light" ? "Dark Mode" : "Light Mode"}
            </DropdownItem>

            {/* TODO: Settings */}
            <DropdownItem
              key="settings"
              startContent={<Settings size={20} />}
              onPress={() =>
                addToast({
                  title: "Settings",
                  description:
                    "Configure settings. This feature is coming soon.",
                  color: "warning",
                })
              }
            >
              Settings
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* App Name */}
      <Tooltip content={siteConfig.name} placement="bottom">
        <Link className="flex justify-self-center" href={`/`} prefetch={false}>
          <Logo height={30} />

          <h1 className={`sr-only`}>{siteConfig.name}</h1>
        </Link>
      </Tooltip>

      {/* User */}
      <ClerkLoading>
        <Skeleton className="flex h-10 w-10 justify-self-end rounded-full" />
      </ClerkLoading>

      <ClerkLoaded>
        <div className="flex justify-self-end">
          <UserButton />
        </div>
      </ClerkLoaded>
    </header>
  );
}
