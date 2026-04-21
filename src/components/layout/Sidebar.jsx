import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import logo from "../../assets/logo.png";
import profile from "../../assets/profile.jpeg";

const Sidebar = () => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    console.log("Current theme dark mode:", isDark);
  }, [isDark]);

  return (
    <aside className="fixed left-0 top-0 w-full h-18 lg:h-screen lg:w-24 bg-sidebar-main flex lg:flex-col items-center justify-between z-[70] lg:rounded-r-[20px]">
      <div className="h-full w-18 lg:w-full lg:h-24 bg-[#7C5DFA] rounded-r-[20px] relative overflow-hidden flex items-center justify-center group cursor-pointer">
        <div className="absolute bottom-0 w-full h-1/2 bg-[#9277FF] rounded-tl-[20px] transition-transform duration-300 group-hover:h-full"></div>
        <div className="relative z-10">
          <img
            src={logo}
            alt="Logo"
            className="w-7 h-7 lg:w-10 lg:h-10 object-contain"
          />
        </div>
      </div>

      <div className="flex lg:flex-col items-center h-full lg:h-auto lg:w-full">
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsDark(!isDark);
          }}
          className="p-6 lg:p-8 text-[#7E88C3] hover:text-white transition-colors cursor-pointer border-r lg:border-r-0 lg:border-b border-[#494E6E]/30"
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <Sun className="w-5 h-5 fill-current animate-in spin-in-180 duration-500" />
          ) : (
            <Moon className="w-5 h-5 fill-current animate-in spin-in-180 duration-500" />
          )}
        </button>

        <div className="p-4 lg:p-6 cursor-pointer">
          <img
            src={profile}
            alt="Profile"
            className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-transparent hover:border-brand transition-all"
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
