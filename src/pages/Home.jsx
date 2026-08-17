import Navbar from "../components/Navbar";
import Weather from "../components/Weather";
import Inquiries from "../components/Inquiries";
import FarmersPosts from "../components/FarmersPosts";
import HarvestForm from "../components/HarvestForm";
import Officers from "../components/Officers";

export default function Home() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <section id="hero" className="hero">
          <h1>🌾 AgriConnect</h1>
          <p>
            Supporting farmers with weather, community posts, harvest tracking &
            expert officers
          </p>
        </section>

        <Weather />
        <HarvestForm />
        <FarmersPosts />
        <Inquiries />
        <Officers />
      </main>
    </div>
  );
}
