export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16 px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        
        {/* Left Content */}
        <div className="flex-1">
          {/* Search bar */}
          <div className="flex items-center bg-white rounded-lg shadow-md overflow-hidden max-w-md">
            <input
              type="text"
              placeholder="Search for courses"
              className="flex-1 px-4 py-2 text-gray-600 outline-none"
            />
            <button className="bg-blue-600 text-white px-4 py-2">
              Search
            </button>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold mt-6 leading-snug">
            You bring the <span className="text-teal-300">expertise</span>,<br />
            we’ll make it unforgettable.
          </h1>

          {/* CTA Button */}
          <button className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-100">
            Visit Courses
          </button>
        </div>

        {/* Right Illustration */}
        <div className="flex-1 flex justify-center">
          <img
            src="https://res.cloudinary.com/dlgrbt3t2/image/upload/v1755586041/Pngtree_a_cheerful_female_taiwanese_student_21290582_yeoecd.png"
            alt="Learning Illustration"
            className="w-full max-w-md"
          />
        </div>
      </div>
    </section>
  );
}


