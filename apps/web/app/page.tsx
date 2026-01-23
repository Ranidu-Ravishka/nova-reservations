import HeroSection from "@/components/sections/home/HeroSection";
import HotelsSection from "@/components/sections/home/HotelsSection";
import NewsletterSection from "@/components/sections/home/NewsLetterSection";
import OffersSection from "@/components/sections/home/OffersSection";
import TestimonialsSection from "@/components/sections/home/TestimonialsSection";
import TransportSection from "@/components/sections/home/TransportSection";

export default function HomePage() {
	return (
		<>
			<HeroSection />
			<HotelsSection />
			<OffersSection />
			<TestimonialsSection />
			<TransportSection />
			<NewsletterSection />
		</>
	);
}
