"use client";

import { UserButton } from "@clerk/nextjs";
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

  if (!mounted) return null; // Hindari rendering sebelum mounting

  return (
    <header className={`flex items-center justify-between p-4`}>
      {/* User */}
      <UserButton />

      {/* App Name */}
      <h1 className={`text-xl font-bold`}>{siteConfig.name}</h1>

      {/* CTA */}
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
    </header>
  );
}
