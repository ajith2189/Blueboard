import { Card, CardContent } from "@/components/ui/card";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Alice Johnson",
      role: "Software Engineer",
      feedback:
        "This platform transformed the way I learn. The courses are structured and easy to follow.",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      name: "Mark Davis",
      role: "Data Analyst",
      feedback:
        "I landed my first job after completing the data science courses here. Highly recommend!",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      name: "Sophia Lee",
      role: "UI/UX Designer",
      feedback:
        "The instructors are industry professionals who provide practical insights and tips.",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-8">What Our Students Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Card key={i} className="shadow-md rounded-2xl p-6">
              <CardContent>
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-16 h-16 mx-auto rounded-full mb-4"
                />
                <p className="text-gray-600 mb-4">“{t.feedback}”</p>
                <h4 className="font-semibold">{t.name}</h4>
                <p className="text-sm text-gray-500">{t.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
