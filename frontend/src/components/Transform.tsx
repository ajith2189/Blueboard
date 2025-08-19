import { Button } from "@/components/ui/button";

const Transform = () => {
  return (
    <section className="py-20 bg-blue-600 text-white text-center">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-6">
          Transform Your Learning Journey Today
        </h2>
        <p className="mb-6 text-lg">
          Unlock access to thousands of courses and take the first step 
          towards achieving your goals.
        </p>
        <Button size="lg" className="bg-white text-blue-600 rounded-full">
          Get Started
        </Button>
      </div>
    </section>
  );
};

export default Transform;
