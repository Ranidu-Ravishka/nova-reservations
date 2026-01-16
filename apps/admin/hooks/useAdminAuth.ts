"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAdminAuth() {
	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem("admin_token");
		if (!token) router.replace("/");
	}, [router]);
}
