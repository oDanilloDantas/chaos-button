import { Hero } from "@/components/Hero/Hero";
import { Benefits } from "@/components/Benefits/Benefits";
import { Footer } from "@/components/Footer/Footer";
import { computeCurrentPrice, formatPrice, getMemberCount } from "@/lib/pricing";

export default function Home() {
  const price = formatPrice(computeCurrentPrice(getMemberCount()));

  return (
    <main>
      <Hero price={price} />
      <Benefits />
      <Footer />
    </main>
  );
}
