import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-blue-600 text-white px-4 py-3">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold">Ikatan Alumni</h1>
      <ul className="flex space-x-4">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'underline' : 'hover:text-gray-300'
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/data-alumni"
            className={({ isActive }) =>
              isActive ? 'underline' : 'hover:text-gray-300'
            }
          >
            Data Alumni
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/tentang"
            className={({ isActive }) =>
              isActive ? 'underline' : 'hover:text-gray-300'
            }
          >
            Tentang
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/kegiatan"
            className={({ isActive }) =>
              isActive ? 'underline' : 'hover:text-gray-300'
            }
          >
            Kegiatan
          </NavLink>
        </li>
      </ul>
    </div>
  </nav>
);

export default Navbar;
