// src/pages/Home.jsx
import { useState } from "react";
import { MdExpandMore } from "react-icons/md";
import HomeHeader from "../components/HomeHeader";

const services = [
  {
    title: "Allergy Testing",
    desc: "Accurate allergy testing to identify substances that trigger allergic reactions."
  },
  {
    title: "Customized Treatment Plans",
    desc: "Tailored plans based on test results and symptoms for better relief."
  },
  {
    title: "Allergy Immunotherapy",
    desc: "Desensitization therapy to reduce allergic symptoms long-term."
  },
  {
    title: "Asthma Management",
    desc: "Comprehensive asthma evaluation, treatment & prevention strategies."
  },
  {
    title: "Allergic Rhinitis",
    desc: "Personalized care for seasonal & perennial rhinitis."
  },
  {
    title: "Angioedema Treatment",
    desc: "Expert care for swelling-related allergic reactions."
  }
];

const Accordion = ({ title, desc }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-lg mb-2 shadow-sm transition duration-300">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-4 text-left font-semibold text-blue-700 hover:bg-blue-50"
      >
        {title}
        <MdExpandMore className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="px-4 pb-4 text-gray-600 transition-opacity duration-300 ease-in-out">{desc}</p>}
    </div>
  );
};

export default function Home() {
  return (
    <div className="font-sans bg-white text-gray-800">
     <HomeHeader/>

      {/* Hero */}
      <section id="home" className="pt-24 bg-gradient-to-r from-blue-100 via-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
            Unlocking the Relief from Allergy
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Personalized care, advanced diagnostics, and compassionate specialists at your service.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-20 px-6 max-w-7xl mx-auto" id="about">
        <h3 className="text-3xl font-semibold text-center text-blue-700 mb-10">Why Choose Us?</h3>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-gray-700 mb-6 text-lg">
              We specialize in comprehensive allergy care—accurate diagnosis, personalized treatment,
              and the latest medical advancements for a better life.
            </p>
            <div className="grid grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">Mission</h4>
                <p>Empowering healthy lives through accessible, personalized allergy care.</p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">Vision</h4>
                <p>To pioneer compassionate allergy care with clinical excellence.</p>
              </div>
            </div>
          </div>
          <img
            src="/1.jpg"
            alt="Doctor"
            className="rounded-xl shadow-lg w-full max-h-[400px] object-cover"
          />
        </div>
      </section>

      {/* Clinic Near You */}
      <section className="bg-blue-50 py-20 px-6" id="clinics">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <img
            src="2.jpg"
            alt="Clinic Near You"
            className="rounded-xl shadow-lg w-full max-h-[400px] object-cover"
          />
          <div>
            <h3 className="text-2xl font-semibold text-blue-700 mb-4">ChanRe Near You</h3>
            <p className="text-gray-700 mb-6 text-lg">
              We are establishing franchise allergy clinics to bring expert care closer to your community.
              Say goodbye to long commutes and hello to local allergy relief.
            </p>
            <button className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">Learn More</button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-20 px-6" id="services">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-semibold text-blue-700 mb-10 text-center">Our Services</h3>
          {services.map((item, index) => (
            <Accordion key={index} title={item.title} desc={item.desc} />
          ))}
        </div>
      </section>

      {/* Allergy Info */}
      <section className="bg-gradient-to-br from-purple-100 via-purple-50 to-white py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <img
            src="3.jpg"
            alt="Immunology"
            className="rounded-xl shadow-lg w-full max-h-[400px] object-cover"
          />
          <div>
            <h3 className="text-2xl font-semibold text-purple-800 mb-4">Allergy & Clinical Immunology</h3>
            <ul className="list-disc list-inside text-gray-700 text-base leading-relaxed">
              <li>Eyes: Itchy, watering</li>
              <li>Nose: Sneezing, block</li>
              <li>Throat: Irritation, soreness</li>
              <li>Skin: Rashes, itching</li>
              <li>GI Tract: Bloating, diarrhea</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Who Should Visit Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-2xl font-semibold text-blue-700 mb-8">Who Should Visit?</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left text-gray-700 text-base">
            <li>1. Complex allergic diseases like asthma or eczema</li>
            <li>2. Severe allergies (e.g., food, drug, insect)</li>
            <li>3. Life-threatening allergic reactions (anaphylaxis)</li>
            <li>4. Suspected occupational/environmental allergies</li>
            <li>5. Food allergy requiring medically supervised challenge</li>
            <li>6. Allergic rhinitis needing immunotherapy</li>
            <li>7. Poor control of asthma despite regular meds</li>
            <li>8. Suspected chronic urticaria or angioedema</li>
            <li>9. Suspected immunodeficiencies</li>
            <li>10. Suspected autoimmune disorders</li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-100 text-sm py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          &copy; 2025 ChanRe Allergy Clinic. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
