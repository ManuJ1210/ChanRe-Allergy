import { Link } from "react-router-dom"
export default function HomeHeader() {
    return(
        <>
        <div className="font-sans bg-white text-gray-800">
       <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-700">ChanRe Allergy Clinic</h1>
          <nav className="space-x-6 text-sm text-gray-700 hidden md:block">
            <Link to="/" className="hover:text-blue-700">Home</Link>
            <Link to="/About" className="hover:text-blue-700">About</Link>
            <Link to="/Contact" className="hover:text-blue-700">Contact</Link>
            <Link to="/login">
              <button className="ml-6 bg-blue-700 text-white px-4 py-1 rounded hover:bg-blue-800 text-sm">
                Login
              </button>
            </Link>
          </nav>
        </div>
      </header>
      </div>
      </>
    )
};
