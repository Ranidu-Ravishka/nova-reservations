export const Roles = {
	ADMIN: "ADMIN",
	CUSTOMER: "CUSTOMER",
	STAFF: "STAFF",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];
