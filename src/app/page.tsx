import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import ServicesOverview from "@/components/sections/ServicesOverview";
import WhyUs from "@/components/sections/WhyUs";
import Reviews from "@/components/sections/Reviews";
import BookingCTA from "@/components/sections/BookingCTA";
import { getAllContent } from "@/lib/content";

export default async function HomePage() {
  const content = await getAllContent();
  return (
    <>
      <Navbar phone={content.global.phone} phoneRaw={content.global.phoneRaw} tagline={content.global.tagline} />
      <main>
        <Hero content={content.hero} />
        <ServicesOverview />
        <WhyUs content={content.why_us} />
        <Reviews />
        <BookingCTA content={content.booking_cta} />
      </main>
      <Footer content={content.global} />
    </>
  );
}
