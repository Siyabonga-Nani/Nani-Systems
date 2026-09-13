import { Hero } from "@/components/home/hero";
import { Services } from "@/components/home/services";
import { WhyUs } from "@/components/home/why-us";
import { Process } from "@/components/home/process";
import { ExistingProject } from "@/components/home/existing-project";
import { Portfolio } from "@/components/home/portfolio";
import { ComingSoon } from "@/components/home/coming-soon";
import { CTA } from "@/components/home/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <WhyUs />
      <Process />
      <ExistingProject />
      <Portfolio />
      <ComingSoon />
      <CTA />
    </>
  );
}