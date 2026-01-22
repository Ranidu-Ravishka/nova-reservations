"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/register", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      router.push("/");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        // @ts-expect-error axios error
        setError(err.response?.data?.message || "Registration failed");
      } else {
        setError("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center bg-charcoal">
      {/* FORCE LIGHT THEME INSIDE CARD */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10 text-black">
        <h1 className="text-3xl font-serif font-semibold text-center mb-2">
          Create Account
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Join NOVA luxury experiences
        </p>

        {error && (
          <p className="mb-4 text-sm text-red-600 text-center">{error}</p>
        )}

        <form onSubmit={submit} className="space-y-5">
          {/* NAME */}
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Full Name
            </Label>
            <Input
              required
              placeholder="Your name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="
                bg-white 
                text-black 
                placeholder:text-gray-400 
                border border-gray-300
                focus:border-gold
                focus:ring-gold
              "
            />
          </div>

          {/* EMAIL */}
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              type="email"
              required
              placeholder="you@email.com"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="
                bg-white 
                text-black 
                placeholder:text-gray-400 
                border border-gray-300
                focus:border-gold
                focus:ring-gold
              "
            />
          </div>

          {/* PASSWORD */}
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <Input
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="
                bg-white 
                text-black 
                placeholder:text-gray-400 
                border border-gray-300
                focus:border-gold
                focus:ring-gold
              "
            />
          </div>

          {/* SUBMIT */}
          <Button
            type="submit"
            disabled={loading}
            className="
              w-full 
              bg-gold 
              text-charcoal 
              font-medium 
              rounded-full 
              py-6
              hover:bg-gold/90
            "
          >
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        {/* LOGIN LINK */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-gold font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
