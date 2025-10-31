import { useAuth } from "@/hooks/use-auth";
import { isUserOnline } from "@/lib/helper";
import { PROTECTED_ROUTES } from "@/routes/routes";
import { Moon, Sun } from "lucide-react";
import React from "react";
import AvatarWithBadge from "./avatar-with-badge";
import Logo from "./logo";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const AsideBar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const isOnline = isUserOnline(user?._id);

  return (
    <aside
      className="
        fixed inset-y-0 left-0 top-0
        z-50 w-11 h-svh
        bg-primary/85 shadow-sm
      "
    >
      <div
        className="
          flex h-full w-full flex-col
          items-center justify-between
          px-1 pt-1 pb-6
        "
      >
        <Logo
          url={PROTECTED_ROUTES.CHAT}
          imgClass="size-7"
          textClass="text-white"
          showText={false}
        />

        <div className="flex flex-col items-center gap-3">
          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="icon"
            className="relative border-0 rounded-full"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun
              className="
                h-[1.2rem] w-[1.2rem]
                rotate-0 scale-100 transition-all
                dark:-rotate-90 dark:scale-0
              "
            />
            <Moon
              className="
                absolute h-[1.2rem] w-[1.2rem]
                rotate-90 scale-0 transition-all
                dark:rotate-0 dark:scale-100
              "
            />
          </Button>

          {/* Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div role="button">
                <AvatarWithBadge
                  name={user?.name || "Unknown"}
                  src={user?.avatar || ""}
                  isOnline={isOnline}
                  className="!bg-white"
                />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="z-50 w-48 rounded-lg"
              align="end"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
};

export default AsideBar;
