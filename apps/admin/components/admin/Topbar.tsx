"use client";

import { LogOut, Menu } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Topbar({
	onOpenMobileNav,
}: {
	onOpenMobileNav: () => void;
}) {
	const router = useRouter();

	const logout = () => {
		try {
			localStorage.removeItem("admin_token");
		} catch {
			// ignore
		}
		router.replace("/");
	};

	return (
		<header className="sticky top-0 z-30 border-b border-white/10 luxury-glass">
			<div className="h-16 px-6 flex items-center gap-3">
				<Button
					variant="ghost"
					size="icon"
					className="md:hidden text-foreground"
					onClick={onOpenMobileNav}
					aria-label="Open navigation"
				>
					<Menu className="h-5 w-5" />
				</Button>

				<div className="ml-auto flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="h-10 px-3 rounded-full bg-white/5 border border-white/10"
							>
								<div className="relative h-7 w-7 overflow-hidden rounded-full bg-white/10">
									<Image
										src="/nova-white.png"
										alt="Nova"
										width={28}
										height={28}
										className="object-contain p-1"
									/>
								</div>
								<span className="ml-2 hidden sm:inline text-sm font-medium">
									Admin Suite
								</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48">
							<DropdownMenuLabel>Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={logout} className="cursor-pointer">
								<LogOut className="mr-2 h-4 w-4" />
								Logout
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
