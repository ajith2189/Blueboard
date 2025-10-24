import Navbar from "../../components/userComponents/Navbar";
import Hero from "../../components/userComponents/Hero";
import Categories from "../../components/userComponents/Categories";
import About from "../../components/userComponents/About";
import Banner from "../../components/userComponents/Banner";
import Stats from "../../components/userComponents/Stats";
import TopCategories from "../../components/userComponents/TopCategories";
import Courses from "../../components/userComponents/Courses";
import Testimonials from "../../components/userComponents/Testimonials";
import Instructor from "../../components/userComponents/Instructor";
import Transform from "../../components/userComponents/Transform";
import Footer from "../../components/userComponents/Footer";

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
