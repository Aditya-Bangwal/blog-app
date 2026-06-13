import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../utils/userslice";
import axios from "axios";
import toast from "react-hot-toast";

function Navbar() {
  const { token, name, profilepic, username } = useSelector(
    (state) => state.user,
  );

  const [showpopup, setshowpopup] = useState(false);
  const [searchquery, setsearchquery] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname !== "/search") {
      setsearchquery(null);
      // setshowpopup(false)
    }
    return () => {
      if (window.location.pathname !== "/") {
        setshowpopup(false);
      }
    };
  }, [window.location.pathname]);

  function handlelogout() {
    dispatch(logout());
    setshowpopup(false);
  }

  return (
    <div>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <img
                className="w-10 hover:scale-105 transition"
                src={logo}
                alt="logo"
              />
            </Link>

            <div className="relative hidden sm:block">
              <i className="fi fi-rr-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>

              <input
                type="text"
                placeholder="Search blogs..."
                value={searchquery || ""}
                onChange={(e) => setsearchquery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const value = searchquery?.trim();

                    if (value) {
                      navigate(`/search?q=${value}`);
                    }
                  }
                }}
                className="w-[220px] md:w-[300px] bg-gray-100 rounded-full py-2 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <Link to="/addblog">
              <button className="flex items-center gap-2 text-gray-600 hover:text-black transition">
                <i className="fi fi-rr-edit text-xl"></i>
                <span className="hidden sm:block font-medium">Write</span>
              </button>
            </Link>

            {token ? (
              <div className="relative">
                <button
                  onClick={() => setshowpopup((prev) => !prev)}
                  className="cursor-pointer"
                >
                  <img
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 hover:border-blue-400 transition"
                    src={
                      profilepic
                        ? profilepic
                        : `https://api.dicebear.com/9.x/initials/svg?seed=${name}`
                    }
                    alt="profile"
                  />
                </button>

                {showpopup && (
                  <div className="absolute right-0 top-14 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-4 py-3 border-b bg-gray-50">
                      <p className="font-semibold truncate">{name}</p>
                      <p className="text-sm text-gray-500 truncate">
                        @{username}
                      </p>
                    </div>

                    <Link
                      to={`/${username}`}
                      onClick={() => setshowpopup(false)}
                    >
                      <div className="px-4 py-3 hover:bg-gray-100 cursor-pointer">
                        Profile
                      </div>
                    </Link>

                    <Link
                      to="/edit-profile"
                      onClick={() => setshowpopup(false)}
                    >
                      <Link to={"/setting"}>
                        <div className="px-4 py-3 hover:bg-gray-100 cursor-pointer">
                          Settings
                        </div>
                      </Link>
                    </Link>

                    <div
                      onClick={handlelogout}
                      className="px-4 py-3 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                    >
                      Logout
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/signin">
                  <button className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50">
                    Sign In
                  </button>
                </Link>

                <Link to="/signup">
                  <button className="px-4 py-2 rounded-full bg-black text-white hover:bg-gray-800">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="sm:hidden px-4 pb-3">
          <div className="relative">
            <i className="fi fi-rr-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>

            <input
              type="text"
              placeholder="Search blogs..."
              value={searchquery || ""}
              onChange={(e) => setsearchquery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value = searchquery?.trim();

                  if (value) {
                    navigate(`/search?q=${value}`);
                    setsearchquery("");
                  }
                }
              }}
              className="w-full bg-gray-100 rounded-full py-2 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </nav>

      <Outlet />
    </div>
  );
}

export default Navbar;
