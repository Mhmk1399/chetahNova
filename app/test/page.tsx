import AISolutions from "@/components/static/Home/AISolutions";
import ContactSection from "@/components/static/Home/ContactSection";
import CTASection from "@/components/global/CTASection";
import FAQSection from "@/components/global/FAQSection";
import HeroSection from "@/components/static/Home/Herosection";
import PortfolioSection from "@/components/static/Home/PortfolioSection";
import ProcessSection from "@/components/static/Home/ProcessSection";
import Services from "@/components/static/Home/Services";
import TestimonialsSection from "@/components/global/TestimonialsSection";
import TrustSection from "@/components/static/Home/Trust";
import WhyChooseUs from "@/components/global/WhyChooseUs";

const page = () => {
  return (
    <div>
      <HeroSection />
      {/* <TrustSection /> */}
      <Services />
      <AISolutions />
      <WhyChooseUs />
      <ProcessSection />
      <PortfolioSection />
      <TestimonialsSection  />
      <CTASection  />
      <FAQSection  />
      <ContactSection  />
    </div>
  );
};

export default page;
