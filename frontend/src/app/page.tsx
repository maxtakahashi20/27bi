import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { About } from "@/components/landing/about";
import { Mission } from "@/components/landing/mission";
import { Courses } from "@/components/landing/courses";
import { Gallery } from "@/components/landing/gallery";
import { Footer } from "@/components/landing/footer";
import { PageLoader } from "@/components/landing/page-loader";

export default function HomePage() {
  return (
    <>
      <PageLoader />
      <main className="relative bg-tactical">
        <Navbar />
        <Hero />
        <About />
        <Mission />
        <Courses />
        <Gallery />
        <Footer />
      </main>
    </>
  );
}
