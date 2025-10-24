export default function About() {
  return (
    <section className="py-20 px-8 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        
        {/* Left Content */}
        <div>
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            At Blueboard, we provide high-quality e-learning solutions designed 
            to empower learners and educators worldwide. Our platform offers 
            intuitive tools, engaging content, and an inclusive community to 
            make learning accessible for everyone.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Learn More
          </button>
        </div>

        {/* Right Image */}
        <div className="flex justify-center">
          <img
            src="/about-image.png"
            alt="About us"
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
