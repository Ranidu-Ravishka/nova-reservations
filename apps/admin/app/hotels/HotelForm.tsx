"use client";

import axios from "axios";
import { Building2, Hotel, Loader2, MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface HotelFormProps {
	onSuccess: () => void;
	editingHotel?: {
		_id: string;
		name: string;
		location: string;
		description?: string;
		phone?: string;
		category?: string;
	} | null;
}

const hotelCategories = [
	"Luxury",
	"Boutique",
	"Business",
	"Resort",
	"Budget",
	"Airport",
	"Casino",
	"Spa",
];

export default function HotelForm({ onSuccess, editingHotel }: HotelFormProps) {
	const [formData, setFormData] = useState({
		name: editingHotel?.name || "",
		location: editingHotel?.location || "",
		description: editingHotel?.description || "",
		phone: editingHotel?.phone || "",
		category: editingHotel?.category || "Luxury",
	});
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = "Hotel name is required";
		}
		if (!formData.location.trim()) {
			newErrors.location = "Location is required";
		}
		if (!formData.phone.trim()) {
			newErrors.phone = "Phone number is required";
		} else if (
			!/^\+?[1-9]\d{0,15}$/.test(formData.phone.replace(/[\s()-]/g, ""))
		) {
			newErrors.phone = "Invalid phone number format";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setLoading(true);
		try {
			const url = editingHotel
				? `http://localhost:4000/api/hotels/${editingHotel._id}`
				: "http://localhost:4000/api/hotels";

			const method = editingHotel ? "put" : "post";

			await axios[method](url, {
				...formData,
				category: formData.category || "Luxury",
			});

			onSuccess();
		} catch (error) {
			console.error("Failed to save hotel:", error);
			setErrors({ submit: "Failed to save hotel. Please try again." });
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	return (
		<Card className="border-none shadow-lg bg-linear-to-br from-white to-gray-50">
			<CardHeader>
				<div className="flex items-center gap-3">
					<div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
						<Building2 className="h-6 w-6 text-blue-600" />
					</div>
					<div>
						<CardTitle className="text-2xl text-gray-900">
							{editingHotel ? "Edit Hotel" : "Add New Hotel"}
						</CardTitle>
						<CardDescription>
							{editingHotel
								? "Update the hotel information"
								: "Add a new hotel to your management system"}
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-5">
					<div className="space-y-3">
						<Label htmlFor="name" className="text-gray-700 font-medium">
							<div className="flex items-center gap-2">
								<Hotel className="h-4 w-4" />
								Hotel Name *
							</div>
						</Label>
						<Input
							id="name"
							placeholder="e.g., Grand Plaza Hotel"
							value={formData.name}
							onChange={(e) => handleChange("name", e.target.value)}
							className={`h-11 text-base ${errors.name ? "border-red-500" : "border-gray-300"}`}
						/>
						{errors.name && (
							<p className="text-sm text-red-500 flex items-center gap-1">
								<span className="text-red-500">⚠</span>
								{errors.name}
							</p>
						)}
					</div>

					<div className="space-y-3">
						<Label htmlFor="location" className="text-gray-700 font-medium">
							<div className="flex items-center gap-2">
								<MapPin className="h-4 w-4" />
								Location *
							</div>
						</Label>
						<Input
							id="location"
							placeholder="e.g., 123 Main Street, New York, NY"
							value={formData.location}
							onChange={(e) => handleChange("location", e.target.value)}
							className={`h-11 text-base ${errors.location ? "border-red-500" : "border-gray-300"}`}
						/>
						{errors.location && (
							<p className="text-sm text-red-500 flex items-center gap-1">
								<span className="text-red-500">⚠</span>
								{errors.location}
							</p>
						)}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<div className="space-y-3">
							<Label htmlFor="phone" className="text-gray-700 font-medium">
								Contact Phone *
							</Label>
							<Input
								id="phone"
								placeholder="+1 (555) 123-4567"
								value={formData.phone}
								onChange={(e) => handleChange("phone", e.target.value)}
								className={`h-11 text-base ${errors.phone ? "border-red-500" : "border-gray-300"}`}
							/>
							{errors.phone && (
								<p className="text-sm text-red-500 flex items-center gap-1">
									<span className="text-red-500">⚠</span>
									{errors.phone}
								</p>
							)}
						</div>

						<div className="space-y-3">
							<Label htmlFor="category" className="text-gray-700 font-medium">
								Category
							</Label>
							<Select
								value={formData.category}
								onValueChange={(value) => handleChange("category", value)}
							>
								<SelectTrigger className="h-11 text-base border-gray-300">
									<SelectValue placeholder="Select category" />
								</SelectTrigger>
								<SelectContent>
									{hotelCategories.map((category) => (
										<SelectItem key={category} value={category}>
											{category}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-3">
						<Label htmlFor="description" className="text-gray-700 font-medium">
							Description
						</Label>
						<Textarea
							id="description"
							placeholder="Brief description about the hotel, amenities, and special features..."
							value={formData.description}
							onChange={(e) => handleChange("description", e.target.value)}
							className="min-h-25 border-gray-300 resize-none"
						/>
					</div>

					{errors.submit && (
						<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
							<p className="text-sm text-red-600">{errors.submit}</p>
						</div>
					)}

					<div className="flex gap-3 pt-2">
						<Button
							type="submit"
							disabled={loading}
							className="flex-1 h-12 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium text-base"
						>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Saving...
								</>
							) : editingHotel ? (
								"Update Hotel"
							) : (
								"Add Hotel"
							)}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
