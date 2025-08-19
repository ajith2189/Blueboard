function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <h3 className="text-4xl font-bold text-blue-600">{value}</h3>
      <p className="text-gray-600 mt-2">{label}</p>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="py-16 px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <StatCard value="250+" label="Courses" />
        <StatCard value="1000+" label="Students" />
        <StatCard value="15+" label="Instructors" />
        <StatCard value="2400+" label="Certificates Awarded" />
      </div>
    </section>
  );
}
