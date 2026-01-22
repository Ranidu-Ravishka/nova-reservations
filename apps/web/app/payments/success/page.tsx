"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const paymentId = params.get("paymentId");
    const payerId = params.get("PayerID");
    const reservationId = params.get("reservation");

    fetch("http://localhost:4000/api/payments/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        paymentId,
        PayerID: payerId,
        reservationId,
      }),
    }).then(() => router.push("/profile/reservations"));
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Processing payment...
    </div>
  );
}
