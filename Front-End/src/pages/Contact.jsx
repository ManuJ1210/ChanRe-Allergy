import HomeHeader from "../components/HomeHeader";

const Contact = () => {
  return (
    <>
    <HomeHeader/>
    <div className="px-4 md:px-16 py-12 bg-white text-gray-800">
      <h2 className="text-3xl font-semibold text-blue-700 mb-8 text-center">Contact Us</h2>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="bg-white shadow-md border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <span className="text-green-600 text-xl">📞</span>
              <p className="text-gray-700">+91 9611768775</p>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-black text-xl">✉️</span>
              <p className="text-gray-700">corporaterelation@chanrerier.com</p>
            </div>
          </div>

          <div className="bg-white shadow-md border border-gray-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 text-xl">📍</span>
              <p className="text-gray-700">
                65, Metro station, 414, 20th Main Rd, near Rajajinagar, West of Chord Road 2nd Stage,<br />
                Rajajinagar, Bengaluru, Karnataka 560010
              </p>
            </div>
          </div>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12..."
            className="rounded-xl w-full h-72 border"
            allowFullScreen=""
            loading="lazy"
            title="ChanRe Location"
          ></iframe>
        </div>

        <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                placeholder="example@domain.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                placeholder="Enter your subject"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                rows="4"
                placeholder="Type your message"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default Contact;
