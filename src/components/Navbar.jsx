import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-primary border-gray-200 ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <NavLink
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="./image/logo.png"
            className="h-8"
            alt="Logo"
          />
          <span className="self-center text-base md:text-xl font-semibold whitespace-nowrap dark:text-white">
            Ikatan Alumni LPI Al-IQOMAH
          </span>
        </NavLink>
        <button
          type="button"
          onClick={toggleMenu}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block py-2 px-3 rounded ${
                    isActive
                      ? "text-tertiary bg-quertiary md:bg-transparent md:text-tertiary"
                      : "text-quaternary hover:bg-gray-100 hover:text-tertiary md:hover:bg-transparent md:hover:text-tertiary "
                  }`
                }
                aria-current="page"
                onClick={() => setIsMenuOpen(false)}
              >
                Beranda
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/kegiatan"
                className={({ isActive }) =>
                  `block py-2 px-3 rounded ${
                    isActive
                      ? "text-tertiary bg-quertiary md:bg-transparent md:text-tertiary"
                      : "text-quaternary hover:bg-gray-100 hover:text-tertiary md:hover:bg-transparent md:hover:text-tertiary "
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Kegiatan
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/data-alumni"
                className={({ isActive }) =>
                  `block py-2 px-3 rounded ${
                    isActive
                      ? "text-tertiary bg-quaternary md:bg-transparent md:text-tertiary"
                      : "text-quaternary hover:bg-gray-100 hover:text-tertiary md:hover:bg-transparent md:hover:text-tertiary "
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Data Alumni
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tentang"
                className={({ isActive }) =>
                  `block py-2 px-3 rounded ${
                    isActive
                      ? "text-tertiary bg-quaternary md:bg-transparent md:text-tertiary"
                      : "text-quaternary hover:bg-gray-100 hover:text-tertiary md:hover:bg-transparent md:hover:text-tertiary "
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Tentang
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
