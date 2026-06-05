"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { LuUser, LuCalendarDays, LuLogOut } from "react-icons/lu";
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
          className="relative w-9 h-9 rounded-full overflow-hidden focus:outline-none shrink-0"
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
            <span className="w-full h-full flex items-center justify-center bg-[#FEA800] text-white text-sm font-bold font-poppins">
              {initial}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-52 rounded-2xl shadow-xl border border-gray-100 bg-white p-2"
      >
        <DropdownMenuItem
          onClick={() => router.push("/profile")}
          className="flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-gray-800 font-poppins rounded-xl cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
        >
          <LuUser size={16} className="text-gray-600 shrink-0" />
          My Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push("/my-bookings")}
          className="flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-gray-800 font-poppins rounded-xl cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
        >
          <LuCalendarDays size={16} className="text-gray-600 shrink-0" />
          My Bookings
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-100 my-1" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-red-500 font-poppins rounded-xl cursor-pointer hover:bg-red-50 focus:bg-red-50"
        >
          <LuLogOut size={16} className="text-red-500 shrink-0" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
