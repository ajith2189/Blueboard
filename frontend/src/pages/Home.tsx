import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import About from "../components/About";
import Banner from "../components/Banner";
import Stats from "../components/Stats";
import TopCategories from "../components/TopCategories";
import Courses from "../components/Courses";
import Testimonials from "../components/Testimonials";
import Instructor from "../components/Instructor";
import Transform from "../components/Transform";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <About />
      <Banner />
      <Stats />
      <TopCategories />
      <Courses />
      <Testimonials />
      <Instructor />
      <Transform />
      <Banner />
      <Footer />
    </>
  );
}
