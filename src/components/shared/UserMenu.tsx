"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { LuUser, LuShoppingBag, LuLogOut } from "react-icons/lu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogout } from "@/hooks/useLogout";

export default function UserMenu() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { logout } = useLogout();

  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "U";

  const handleLogout = () => {
    logout();
    router.push("/");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button
          className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-white hover:ring-[#294F98]/30 transition-all focus:outline-none shrink-0"
          aria-label="User menu"
        >
          {user?.photo ? (
            <Image
              src={user.photo}
              alt={user.name ?? "User"}
              fill
              sizes="36px"
              className="object-cover"
              referrerPolicy="no-referrer"
              unoptimized
            />
          ) : (
            <span className="w-full h-full flex items-center justify-center bg-[#294F98] text-white text-sm font-bold">
              {initial}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-48 rounded-xl shadow-lg border border-gray-100 bg-white p-1"
      >
        <div className="px-3 py-2 mb-1 flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
            {user?.photo ? (
              <Image
                src={user.photo}
                alt={user.name ?? "User"}
                fill
                sizes="32px"
                className="object-cover"
                referrerPolicy="no-referrer"
                unoptimized
              />
            ) : (
              <span className="w-full h-full flex items-center justify-center bg-[#294F98] text-white text-xs font-bold">
                {initial}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-gray-100" />

        <DropdownMenuItem
          onClick={() => router.push("/dashboard?section=profile")}
          className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
        >
          <LuUser size={15} className="text-gray-500 shrink-0" />
          My Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push("/dashboard?section=orders")}
          className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
        >
          <LuShoppingBag size={15} className="text-gray-500 shrink-0" />
          My Orders
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-100" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-red-500 rounded-lg cursor-pointer hover:bg-red-50 focus:bg-red-50"
        >
          <LuLogOut size={15} className="text-red-500 shrink-0" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
