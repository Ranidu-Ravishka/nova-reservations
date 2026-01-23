import {
	Facebook,
	Instagram,
	Mail,
	MapPin,
	Phone,
	Twitter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const hotels = [
	{
		name: "Nova Colombo",
		address: "123 Galle Face, Colombo 03",
		phone: "+94 11 234 5678",
	},
	{
		name: "Nova Kandy",
		address: "45 Temple Road, Kandy",
		phone: "+94 81 234 5678",
	},
	{
		name: "Nova Galle",
		address: "78 Lighthouse Street, Galle Fort",
		phone: "+94 91 234 5678",
	},
	{
		name: "Nova Nuwara Eliya",
		address: "12 Hill Country Lane, Nuwara Eliya",
		phone: "+94 52 234 5678",
	},
];

const quickLinks = [
	{ name: "About Us", href: "/about" },
	{ name: "Rooms & Suites", href: "/rooms" },
	{ name: "Transport Service", href: "/transport" },
	{ name: "Special Offers", href: "/offers" },
	{ name: "Contact Us", href: "/contact" },
	{ name: "Careers", href: "/careers" },
];

export function Footer() {
	return (
		<footer className="bg-charcoal text-ivory">
			<div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
					{/* Brand */}
					<div className="lg:col-span-1">
						<div className="flex flex-col mb-6">
							<Link href="/" aria-label="NOVA Home" className="w-fit">
								<Image
									src={
										"https://drive.google.com/uc?export=view&id=157D1c8TFTpM1ivRzzrCvkvAiFVpxdiIb"
									}
									alt="NOVA logo"
									width={160}
									height={44}
									className="h-11 w-auto"
								/>
							</Link>
							<span className="mt-2 text-xs tracking-[0.3em] text-gold uppercase">
								Reservations Group
							</span>
						</div>
						<p className="text-ivory/60 text-sm leading-relaxed mb-6">
							Experience unparalleled luxury across four stunning destinations
							in Sri Lanka. Where every moment becomes a cherished memory.
						</p>
						<div className="flex gap-4">
							<Link
								href="/"
								className="w-10 h-10 rounded-full border border-ivory/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
								aria-label="Instagram"
							>
								<Instagram className="w-4 h-4" />
							</Link>
							<Link
								href="/"
								className="w-10 h-10 rounded-full border border-ivory/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
								aria-label="Facebook"
							>
								<Facebook className="w-4 h-4" />
							</Link>
							<Link
								href="/"
								className="w-10 h-10 rounded-full border border-ivory/20 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
								aria-label="Twitter"
							>
								<Twitter className="w-4 h-4" />
							</Link>
						</div>
					</div>

					{/* Hotels */}
					<div className="lg:col-span-2">
						<h3 className="text-lg font-serif font-semibold mb-6">
							Our Hotels
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							{hotels.map((hotel) => (
								<div key={hotel.name} className="space-y-2">
									<h4 className="text-gold font-medium">{hotel.name}</h4>
									<div className="flex items-start gap-2 text-sm text-ivory/60">
										<MapPin className="w-4 h-4 mt-0.5 shrink-0" />
										<span>{hotel.address}</span>
									</div>
									<div className="flex items-center gap-2 text-sm text-ivory/60">
										<Phone className="w-4 h-4 shrink-0" />
										<span>{hotel.phone}</span>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Quick Links & Contact */}
					<div>
						<h3 className="text-lg font-serif font-semibold mb-6">
							Quick Links
						</h3>
						<ul className="space-y-3">
							{quickLinks.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-sm text-ivory/60 hover:text-gold transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
						<div className="mt-8">
							<h3 className="text-lg font-serif font-semibold mb-4">Support</h3>
							<div className="space-y-3">
								<a
									href="mailto:reservations@novareservations.lk"
									className="flex items-center gap-2 text-sm text-ivory/60 hover:text-gold transition-colors"
								>
									<Mail className="w-4 h-4" />
									reservations@novareservations.lk
								</a>
								<a
									href="tel:+94112345678"
									className="flex items-center gap-2 text-sm text-ivory/60 hover:text-gold transition-colors"
								>
									<Phone className="w-4 h-4" />
									+94 11 234 5678 (24/7)
								</a>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-16 pt-8 border-t border-ivory/10 flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-sm text-ivory/40">
						© {new Date().getFullYear()} Nova Reservations Group. All rights
						reserved.
					</p>
					<div className="flex gap-6">
						<Link
							href="/privacy"
							className="text-sm text-ivory/40 hover:text-gold transition-colors"
						>
							Privacy Policy
						</Link>
						<Link
							href="/terms"
							className="text-sm text-ivory/40 hover:text-gold transition-colors"
						>
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
