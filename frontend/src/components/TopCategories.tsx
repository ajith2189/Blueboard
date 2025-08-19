function CategoryCard({ title, image }: { title: string; image: string }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer">
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4 bg-white">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
    </div>
  );
}

export default function TopCategories() {
  return (
    <section className="py-20 px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Top Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <CategoryCard title="Design" image="/design.jpg" />
          <CategoryCard title="Development" image="/development.jpg" />
          <CategoryCard title="Business" image="/business.jpg" />
        </div>
      </div>
    </section>
  );
}
