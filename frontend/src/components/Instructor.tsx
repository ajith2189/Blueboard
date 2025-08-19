import { Button } from "@/components/ui/button";

const Instructor = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center px-6">
        <img
          src="https://images.pexels.com/photos/1181355/pexels-photo-1181355.jpeg"
          alt="Instructor"
          className="rounded-2xl shadow-lg"
        />
        <div>
          <h2 className="text-3xl font-bold mb-4">
            Become an Instructor with Us
          </h2>
          <p className="text-gray-600 mb-6">
            Share your knowledge with thousands of eager learners worldwide. 
            Inspire, teach, and grow with our community-driven platform.
          </p>
          <Button size="lg" className="rounded-full">
            Start Teaching
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Instructor;
