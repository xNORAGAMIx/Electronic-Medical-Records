import {
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0a0f2c] text-white py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* About Section */}
        <div>
          <h3 className="text-2xl font-bold mb-4 text-cyan-300">About Us</h3>
          <p className="text-gray-400">
            Empowering healthcare with blockchain-secured medical records.
          </p>
        </div>

        {/* Links Section */}
        <div>
          <h3 className="text-2xl font-bold mb-4 text-cyan-300">Links</h3>
          <ul className="text-gray-400 space-y-2">
            <li>
              <Link to="/" className="hover:text-cyan-300 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-cyan-300 transition">
                Services
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-cyan-300 transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-2xl font-bold mb-4 text-cyan-300">Contact</h3>
          <p className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
            <FaEnvelope className="text-cyan-300" />
            <a
              href="mailto:2320403107@stu.manit.ac.in"
              className="hover:underline"
            >
              Manas Das
            </a>
          </p>
          <p className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
            <FaEnvelope className="text-cyan-300" />
            <a
              href="mailto:2320403108@stu.manit.ac.in"
              className="hover:underline"
            >
              Preeti Gautam
            </a>
          </p>
          <p className="flex items-center justify-center md:justify-start gap-2 text-gray-400 mt-2">
            <FaPhoneAlt className="text-cyan-300" />
            <a href="tel:+919641752610" className="hover:underline">
              +91 *****2610
            </a>
          </p>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="text-center text-gray-500 mt-10 text-sm">
        &copy; {new Date().getFullYear()} EMR App. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
