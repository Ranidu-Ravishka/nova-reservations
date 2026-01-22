"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Payment = {
  _id: string;
  amount: number;
  currency: string;
  method: string;
  status: "PENDING" | "PAID" | "FAILED";
  userId: { name: string; email: string };
  createdAt: string;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/payments", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    })
      .then((res) => res.json())
      .then(setPayments);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Payments</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {payments.map((p) => (
            <TableRow key={p._id}>
              <TableCell>{p.userId.name}</TableCell>
              <TableCell>{p.userId.email}</TableCell>
              <TableCell>
                ${p.amount} {p.currency}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    p.status === "PAID"
                      ? "default"
                      : p.status === "FAILED"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {p.status}
                </Badge>
              </TableCell>
              <TableCell>{p.method}</TableCell>
              <TableCell>
                {new Date(p.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
