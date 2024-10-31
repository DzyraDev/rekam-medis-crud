/* eslint-disable no-restricted-globals */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, reset } from "../../features/authSlice";
import {
  Home,
  Users,
  Heart,
  Bell,
  Grid,
  LogOut as LogOutIcon,
  Menu,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  const NavItem = ({ path, icon: Icon, children }) => {
    const isActive = location.pathname === path;

    return (
      <button
        onClick={() => navigate(path)}
        className={`flex items-center p-3 rounded-lg transition-all duration-300 w-full
          ${
            isActive ? "bg-blue-600 text-white shadow-lg" : "hover:bg-gray-700"
          } 
          ${isCollapsed ? "justify-center" : "justify-start"}`}
      >
        <Icon className={`${isCollapsed ? "mr-0" : "mr-3"} h-5 w-5`} />
        {!isCollapsed && <span className="font-medium">{children}</span>}
      </button>
    );
  };

  const SectionTitle = ({ children }) =>
    !isCollapsed && (
      <h2 className="text-lg font-semibold px-3 py-2 text-gray-300">
        {children}
      </h2>
    );

  return (
    <div
      className={`relative min-h-screen bg-gray-900 text-gray-100 shadow-xl
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-20" : "w-64"}`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-blue-600 p-1.5 rounded-full shadow-lg
          hover:bg-blue-700 transition-colors duration-200"
      >
        <ChevronRight
          className={`text-white transition-transform duration-300 h-4 w-4
            ${isCollapsed ? "rotate-180" : ""}`}
        />
      </button>

      <aside className="flex flex-col p-4 h-full">
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "justify-start"
          } mb-8`}
        >
          <Menu className="h-6 w-6 text-blue-500" />
          {!isCollapsed && (
            <span className="ml-3 text-xl font-bold text-white">Menu</span>
          )}
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <SectionTitle>General</SectionTitle>
            <ul className="space-y-2">
              <li>
                <NavItem path="/dashboard" icon={Home}>
                  Dashboard
                </NavItem>
              </li>
              {user?.role === "pasien" && (
                <>
                  <li>
                    <NavItem path="/profil-pasien" icon={Home}>
                      Profil
                    </NavItem>
                  </li>
                </>
              )}
              {user?.role === "dokter" && (
                <>
                  <li>
                    <NavItem path="/profil-dokter" icon={Home}>
                      Profil
                    </NavItem>
                  </li>
                </>
              )}
              {user?.role === "admin" && (
                <>
                  <li>
                    <NavItem path="/dokter" icon={Users}>
                      Dokter
                    </NavItem>
                  </li>
                  <li>
                    <NavItem path="/pasien" icon={Heart}>
                      Pasien
                    </NavItem>
                  </li>
                </>
              )}
              <li>
                <NavItem path="/antrian" icon={Grid}>
                  Antrian
                </NavItem>
              </li>
              <li>
                <NavItem path="/rekam-medis" icon={Bell}>
                  Rekam Medis
                </NavItem>
              </li>
            </ul>
          </div>

          {user?.role === "admin" && (
            <div>
              <SectionTitle>Admin</SectionTitle>
              <ul>
                <li>
                  <NavItem path="/users" icon={Users}>
                    Users
                  </NavItem>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-gray-700">
          <SectionTitle>Settings</SectionTitle>
          <button
            onClick={logout}
            className={`w-full flex items-center p-3 rounded-lg text-red-400
              hover:bg-red-500/20 transition-colors duration-200
              ${isCollapsed ? "justify-center" : "justify-start"}`}
          >
            <LogOutIcon
              className={`h-5 w-5 ${isCollapsed ? "mr-0" : "mr-3"}`}
            />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
