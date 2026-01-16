const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

/* ---------------- AUTH ---------------- */

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Login failed");
  }

  return res.json();
}

/* ---------------- HOTELS ---------------- */

export async function fetchHotels() {
  const res = await fetch(`${API_BASE_URL}/hotels`);

  if (!res.ok) {
    throw new Error("Failed to fetch hotels");
  }

  return res.json();
}

export async function fetchHotelById(id: string) {
  const res = await fetch(`${API_BASE_URL}/hotels/${id}`);

  if (!res.ok) {
    throw new Error("Hotel not found");
  }

  return res.json();
}

/* ---------------- ROOMS ---------------- */

export async function fetchRooms(hotelId?: string) {
  const url = hotelId
    ? `${API_BASE_URL}/rooms?hotel=${hotelId}`
    : `${API_BASE_URL}/rooms`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch rooms");
  }

  return res.json();
}

/* ---------------- BOOKINGS ---------------- */

export async function createReservation(
  token: string,
  payload: Record<string, any>
) {
  const res = await fetch(`${API_BASE_URL}/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Booking failed");
  }

  return res.json();
}
