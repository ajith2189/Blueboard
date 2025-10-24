function CourseCard({ title, teacher, price, image }: 
  { title: string; teacher: string; price: string; image: string }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden">
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-500 text-sm">by {teacher}</p>
        <p className="text-blue-600 font-bold mt-2">{price}</p>
      </div>
    </div>
  );
}

export default function Courses() {
  return (
    <section className="py-20 px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Best Seller Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <CourseCard title="React Basics" teacher="John Doe" price="$49" image="/react.jpg" />
          <CourseCard title="Mastering HTML" teacher="Jane Smith" price="$29" image="/html.jpg" />
          <CourseCard title="MongoDB Crash Course" teacher="Chris Lee" price="$39" image="/mongodb.jpg" />
          <CourseCard title="SQL for Beginners" teacher="Sarah Kim" price="$25" image="/sql.jpg" />
        </div>
      </div>
    </section>
  );
}
