import { Link } from "react-router-dom"
export default function HomeHeader() {
    return(
        <>
        <div className="font-sans bg-gradient-to-br from-slate-50 to-purple-50 text-slate-800">
       <header className="bg-gradient-to-br from-slate-50 to-purple-50 shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <h1 className="text-xl font-extrabold text-purple-700">ChanRe Allergy Clinic</h1>
          <nav className="space-x-6 text-sm text-slate-700 hidden md:block">
            <Link to="/" className="hover:text-purple-700">Home</Link>
            <Link to="/About" className="hover:text-purple-700">About</Link>
            <Link to="/Contact" className="hover:text-purple-700">Contact</Link>
            <Link to="/login">
              <button className="ml-6 bg-gradient-to-r from-purple-400 to-purple-600 text-white px-4 py-1 rounded-xl hover:from-purple-500 hover:to-purple-700 text-sm font-semibold shadow transition-all duration-150">
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
