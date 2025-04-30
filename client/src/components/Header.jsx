import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../redux/user/userSlice";
import { useState } from "react";
import {
  FiMenu,
  FiX,
  FiHome,
  FiInfo,
  FiPhone,
  FiClipboard,
  FiLogOut,
  FiUserPlus,
  FiCalendar,
  FiGrid,
} from "react-icons/fi";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const hhNumber = useSelector((state) => state.user.hhNumber);
  const licenseNumber = useSelector((state) => state.user.licenseNumber);

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.clear();
    navigate("/");
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="bg-[#0a0f2c] text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-4 relative">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl md:text-3xl font-bold tracking-wide text-cyan-300 hover:text-cyan-400 transition"
        >
          LifeLedger
        </Link>

        {/* Hamburger Icon */}
        <button onClick={toggleMenu} className="md:hidden text-3xl">
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Navigation */}
        <nav
          className={`absolute md:static w-full md:w-auto top-16 left-0 md:top-0 bg-[#0a1031] md:bg-transparent transition-all duration-300 z-40 ${
            menuOpen ? "block" : "hidden"
          } md:block`}
        >
          <ul className="flex flex-col md:flex-row items-center gap-6 md:gap-10 px-6 md:px-0 py-4 md:py-0 text-base font-medium">
            <li>
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 hover:text-cyan-300 transition"
              >
                <FiHome className="text-lg" />
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/hospitals"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 hover:text-cyan-300 transition"
              >
                <FiClipboard className="text-lg" />
                Hospitals
              </Link>
            </li>

            {!isLoggedIn ? (
              <>
                <li>
                  <Link
                    to="/about"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 hover:text-cyan-300 transition"
                  >
                    <FiInfo className="text-lg" />
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 hover:text-cyan-300 transition"
                  >
                    <FiGrid className="text-lg" />
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 hover:text-cyan-300 transition"
                  >
                    <FiPhone className="text-lg" />
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 bg-cyan-400 text-black px-5 py-2 rounded-md hover:bg-cyan-500 transition duration-300 shadow"
                  >
                    <FiUserPlus className="text-lg" />
                    Get Started
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  {hhNumber ? (
                    <Link
                      to={`/patient-appointments`}
                      className="hover:text-cyan-300 transition duration-300 flex items-center gap-x-2"
                    >
                      <FiCalendar className="space-x-7 text-lg" />
                      Appointments
                    </Link>
                  ) : licenseNumber ? (
                    <Link
                      to={`/doctor-appointments`}
                      className="hover:text-cyan-300 transition duration-300 flex items-center gap-x-2"
                    >
                      <FiCalendar className="text-lg space-x-7" />
                      Appointments
                    </Link>
                  ) : (
                    <></>
                  )}
                </li>
                <li>
                  {hhNumber ? (
                    <Link
                      to={`/patient/${hhNumber}`}
                      className="hover:text-cyan-300 transition duration-300 flex items-center gap-x-2"
                    >
                      <FiGrid className="space-x-7 text-lg" />
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      to={`/doctor/${licenseNumber}`}
                      className="hover:text-cyan-300 transition duration-300 flex items-center gap-x-2"
                    >
                      <FiGrid className="space-x-7 text-lg" />
                      Dashboard
                    </Link>
                  )}
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="cursor-pointer flex items-center gap-2 bg-rose-500 px-5 py-2 rounded-md hover:bg-rose-600 transition duration-300 shadow"
                  >
                    <FiLogOut className="text-lg " />
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
