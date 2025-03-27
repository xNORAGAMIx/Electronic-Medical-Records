import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { clearUser } from "../redux/user/userSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.clear();
    navigate("/");
  };

  const hhNumber = localStorage.getItem("hhNumber");

  return (
    <header className="bg-white text-black flex justify-between items-center shadow-md px-6 py-4">
  <h1 className="text-2xl font-bold text-blue-600">MyBrand</h1>
  <nav>
    <ul className="flex items-center gap-6">
      <li>
        <Link
          to="/"
          className="text-black hover:text-blue-600 transition duration-300"
        >
          Home
        </Link>
      </li>
      {!isLoggedIn ? (
        <>
          <li>
            <Link
              to="/about"
              className="text-black hover:text-blue-600 transition duration-300"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/services"
              className="text-black hover:text-blue-600 transition duration-300"
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="text-black hover:text-blue-600 transition duration-300"
            >
              Contact
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Get Started
            </Link>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link
              to={`/patient/${hhNumber}`}
              className="text-black hover:text-blue-600 transition duration-300"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
            >
              Logout
            </button>
          </li>
        </>
      )}
    </ul>
  </nav>
</header>
  );
};

export default Header;
