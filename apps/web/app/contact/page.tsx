import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = {
	title: "Contact Us | NOVA",
	description:
		"Get in touch with NOVA for reservations, inquiries, and support.",
};

export default function ContactPage() {
	return (
		<main className="bg-charcoal text-ivory">
			<section className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
				<div className="mb-10 text-center">
					<h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-wide">
						Contact Us
					</h1>
					<p className="mt-3 text-sm md:text-base text-ivory/80">
						We&apos;d love to hear from you. Send us a message and our team will
						get back to you soon.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
					{/* Contact Details */}
					<div className="rounded-2xl border border-white/10 bg-white/5 p-6">
						<h2 className="text-xl font-semibold mb-4">Hotel Contacts</h2>
						<ul className="space-y-4 text-sm">
							<li>
								<p className="font-medium">Nova Colombo</p>
								<p className="text-ivory/80">123 Ocean Drive, Colombo 03</p>
								<p className="text-ivory/80">+94 11 234 5678</p>
							</li>
							<li>
								<p className="font-medium">Nova Kandy</p>
								<p className="text-ivory/80">45 Temple Street, Kandy</p>
								<p className="text-ivory/80">+94 81 234 5678</p>
							</li>
							<li>
								<p className="font-medium">Nova Galle</p>
								<p className="text-ivory/80">
									78 Lighthouse Street, Galle Fort
								</p>
								<p className="text-ivory/80">+94 91 234 5678</p>
							</li>
							<li>
								<p className="font-medium">Nova Nuwara Eliya</p>
								<p className="text-ivory/80">
									12 Hill Country Lane, Nuwara Eliya
								</p>
								<p className="text-ivory/80">+94 52 234 5678</p>
							</li>
						</ul>

						<div className="mt-8">
							<h3 className="text-lg font-semibold mb-2">General Inquiries</h3>
							<p className="text-sm text-ivory/80">
								Email: hello@novahotels.com
							</p>
							<p className="text-sm text-ivory/80">Phone: +94 11 200 3000</p>
						</div>
					</div>

					{/* Contact Form */}
					<div className="rounded-2xl border border-white/10 bg-white/5 p-6">
						<form className="space-y-5" action="#" method="post">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
								<div className="space-y-2">
									<Label htmlFor="name">Name</Label>
									<Input
										id="name"
										name="name"
										placeholder="Your name"
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										name="email"
										type="email"
										placeholder="you@example.com"
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="subject">Subject</Label>
								<Input
									id="subject"
									name="subject"
									placeholder="How can we help?"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="message">Message</Label>
								<Textarea
									id="message"
									name="message"
									placeholder="Write your message..."
									rows={6}
									required
								/>
							</div>

							<div className="flex items-center justify-end">
								<Button
									type="submit"
									className="bg-gold text-charcoal rounded-full"
								>
									Send Message
								</Button>
							</div>
						</form>
					</div>
				</div>
			</section>
		</main>
	);
}
