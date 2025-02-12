
import { LogIn, LogOut, User } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-scroll";


const Navbar = () => {

  return (
    <nav className="border-b backdrop-blur fixed z-50 min-w-full shadow-md">
      <div className="container flex h-16 items-center justify-between hover:cursor-pointer">
        <Link to="hero" smooth={true} duration={300} className="flex items-center gap-2 -ml-3 mr-4">
          <span className="text-2xl font-bold text-primary">ecotrace</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
