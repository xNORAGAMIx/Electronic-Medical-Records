import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex mx-auto justify-between items-center max-w-[1300px] py-4 ">
      <nav class="hidden sm:inline-block">
        <ul class="flex gap-3 md:gap-5 lg:gap-10">
          <li class="uppercase font-bold text-xs text-white">
            <Link href="#">ABOUT</Link>
          </li>
          <li class="uppercase font-bold text-xs text-white">
            <Link href="#">SERVICES</Link>
          </li>
          <li class="uppercase font-bold text-xs text-white">
            <Link href="#">TECHNOLOGIES</Link>
          </li>
          <li class="uppercase font-bold text-xs text-white">
            <Link href="#">HOW TO</Link>
          </li>
        </ul>
      </nav>

      <ul class="hidden sm:flex gap-3 md:gap-5 lg:gap-9">
        <li className="uppercase font-bold text-xs text-white border-2 border-white rounded-[40px] py-1 px-3  md:py-2 lg:py-4 md:px-4 lg:px-9 ">
            <Link>Contact Us</Link>
        </li>
        <li className="uppercase font-bold text-xs rounded-[40px] py-1 px-3 md:py-2 lg:py-4 md:px-4 lg:px-9 text-[#302c42]  bg-gradient-to-r from-[#8176AF] to-[#C0B7E8]">
            <Link to="/patient-register">Register</Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
