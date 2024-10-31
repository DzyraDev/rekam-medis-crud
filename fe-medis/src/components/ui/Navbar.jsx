import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../logo2.png";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../../features/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <NavLink
              to="/dashboard"
              className="flex-shrink-0 flex items-center"
            >
              <img
                src={logo}
                alt="Logo"
                className="h-8 w-auto object-contain"
                height={340}
              />
            </NavLink>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center">
            <div className="ml-4 flex items-center space-x-4">
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg
                          text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                          transition-all duration-200"
              >
                Log out
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700
                        hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2
                        focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              <div className="h-6 w-6 flex flex-col justify-between">
                <span
                  className={`block w-full h-0.5 bg-current transform transition duration-300 ease-in-out
                            ${
                              isMobileMenuOpen
                                ? "rotate-45 translate-y-2.5"
                                : ""
                            }`}
                />
                <span
                  className={`block w-full h-0.5 bg-current transition duration-300 ease-in-out
                            ${isMobileMenuOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`block w-full h-0.5 bg-current transform transition duration-300 ease-in-out
                            ${
                              isMobileMenuOpen
                                ? "-rotate-45 -translate-y-2.5"
                                : ""
                            }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`sm:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <button
            onClick={logout}
            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium
                      text-gray-700 hover:text-gray-900 hover:bg-gray-100
                      transition duration-150 ease-in-out"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
