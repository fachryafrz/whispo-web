import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Skeleton } from "@heroui/skeleton";
import { Tooltip } from "@heroui/tooltip";
import Link from "next/link";
import { EllipsisVertical, Moon, Settings, Sun } from "lucide-react";
import { addToast } from "@heroui/toast";

import Logo from "../logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-10 w-10 items-center justify-center rounded-full outline-none transition-all hover:bg-default/40">
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem className="cursor-pointer" onClick={onChange}>
              {resolvedTheme === "light" ? (
                <Moon size={20} />
              ) : (
                <Sun size={20} />
              )}
              <div>
                {resolvedTheme === "light" ? "Dark Mode" : "Light Mode"}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                addToast({
                  title: "Settings",
                  description:
                    "Configure settings. This feature is coming soon.",
                  color: "warning",
                });
              }}
            >
              <Settings size={20} />
              <div>Settings</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* NOTE: Keep this until this Issue is fixed: https://github.com/heroui-inc/heroui/issues/4786 */}
        {/* <Dropdown placement="bottom-start">
          <DropdownTrigger>
            <Button isIconOnly radius="full" variant="light">
              <EllipsisVertical />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Menu">
            // Toggle theme
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

            // TODO: Settings
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
        </Dropdown> */}
        {/* NOTE: Keep this until this Issue is fixed: https://github.com/heroui-inc/heroui/issues/4786 */}
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
