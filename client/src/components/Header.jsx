import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../redux/user/userSlice";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.clear();
    navigate("/");
  };

  const hhNumber = localStorage.getItem("hhNumber");

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-4xl font-extrabold tracking-wider">
          LifeLedger
        </Link>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white text-3xl">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Navigation */}
        <nav
          className={`md:flex items-center gap-8 transition-all duration-300 ${
            menuOpen ? "block" : "hidden"
          } md:block absolute md:relative top-16 md:top-0 left-0 w-full md:w-auto bg-blue-900 md:bg-transparent z-10 md:z-auto shadow-md md:shadow-none`}
        >
          <ul className="flex flex-col md:flex-row items-center gap-6 text-lg font-medium">
            <li>
              <Link
                to="/"
                className="hover:text-yellow-400 transition duration-300"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/hospitals"
                className="hover:text-yellow-400 transition duration-300"
              >
                Hospitals
              </Link>
            </li>

            {!isLoggedIn ? (
              <>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-yellow-400 transition duration-300"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="hover:text-yellow-400 transition duration-300"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-yellow-400 transition duration-300"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="bg-yellow-500 text-black px-6 py-2 rounded-md hover:bg-yellow-600 transition duration-300 shadow-md"
                  >
                    Get Started
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to={`/patient-appointments`}
                    className="hover:text-yellow-400 transition duration-300"
                  >
                    Appointments
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/patient/${hhNumber}`}
                    className="hover:text-yellow-400 transition duration-300"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 px-6 py-2 rounded-md hover:bg-red-600 transition duration-300 shadow-md"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
