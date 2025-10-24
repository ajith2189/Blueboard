interface BannerProps {
  dark?: boolean;
}

export default function Banner({ dark = false }: BannerProps) {
  return (
    <section
      className={`py-16 px-8 text-center ${
        dark ? "bg-gray-900 text-white" : "bg-blue-600 text-white"
      }`}
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Join us and transform your learning experience
        </h2>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
          Get Started
        </button>
      </div>
    </section>
  );
}
