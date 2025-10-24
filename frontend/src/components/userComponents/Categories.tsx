import { Laptop, Palette, BarChart3 } from "lucide-react";

function CategoryCard({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 px-8 py-10 rounded-xl shadow-md hover:bg-blue-600 hover:text-white transition cursor-pointer">
      <div className="text-4xl mb-4">{icon}</div>
      <p className="text-lg font-semibold">{title}</p>
    </div>
  );
}

export default function Categories() {
  return (
    <section className="py-16 px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <CategoryCard icon={<Laptop />} title="Web Development" />
        <CategoryCard icon={<Palette />} title="User Experience" />
        <CategoryCard icon={<BarChart3 />} title="Marketing" />
      </div>
    </section>
  );
}
