import CTASection from "@/components/global/CTAsection";
import Faq from "@/components/global/Faq";
import Lead from "@/components/global/Lead";
import ServicesOverview from "@/components/global/OurService";
import ProcessSection from "@/components/global/ProcessSection";
import Testimonials from "@/components/global/Testimonial";
import WhyChooseUs from "@/components/global/WhyChooseUs";
// import Work from "@/components/global/Work";
import AISolutions from "@/components/static/AiSolution";
import HeroSection from "@/components/static/HeroSection";
import PortfolioPreview from "@/components/static/PortfolioPreview";
import TrustBar from "@/components/static/trustbar";

const page = () => {
  return (
    <main>
      <section>
        {" "}
        <HeroSection />{" "}
      </section>
      <section>
        {" "}
        <TrustBar />{" "}
      </section>
      <section>
        {" "}
        <ServicesOverview />{" "}
      </section>
      <section>
        {" "}
        <AISolutions />{" "}
      </section>
      <section>
        {" "}
        <WhyChooseUs />{" "}
      </section>
      <section>
        {" "}
        <ProcessSection />{" "}
      </section>
      <section>
        {" "}
        <PortfolioPreview />{" "}
      </section>
      <section>
        {" "}
        <Testimonials />{" "}
      </section>
      <section>
        {" "}
        <CTASection />{" "}
      </section>
      {/* <section>
        {" "}
        <Work />{" "}
      </section> */}

      <section>
        {" "}
        <Lead />{" "}
      </section>
      <section>
        {" "}
        <Faq />{" "}
      </section>
    </main>
  );
};

export default page;
