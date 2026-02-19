import Faq from "@/components/global/Faq";
import Lead from "@/components/global/Lead";
import Services from "@/components/global/Servicesection";
import WhyUs from "@/components/global/WhyUs";
import Work from "@/components/global/Work";
import HeroSection from "@/components/static/HeroSection";

const page = () => {
  return (
    <main>
       <section id="hero-section">
        {" "}
        <HeroSection />{" "}
      </section>
      <section id="whyus">
        {" "}
        <WhyUs />{" "}
      </section>
      <section id="services">
        {" "}
        <Services />{" "}
      </section>
      <section id="work">
        {" "}
        <Work />{" "}
      </section>

      <section id="lead">
        {" "}
        <Lead />{" "}
      </section>
      <section id="faq">
        {" "}
        <Faq />{" "}
      </section>
    </main>
  );
};

export default page;
