import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatdate } from "../utils/formatdate";
import { handlesaveblog } from "../pages/Blogpage";
import { useSelector } from "react-redux";
import Displayblogs from "./Displayblogs";
import Usepagination from "../hooks/usepagination";

function Homepage() {
  const { token, id: userId } = useSelector((slice) => slice.user);
  const [page, setpage] = useState(1);
  const { blogs, hashmore } = Usepagination("blogs", {}, 1, page);
  const trendingTopics = [
    "React",
    "Node.js",
    "MongoDB",
    "JavaScript",
    "Express",
    "MERN",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-[70%]">
          {blogs.length > 0 && (
            <Displayblogs
              blogs={blogs}
              token={token}
              userId={userId}
              handlesaveblog={handlesaveblog}
            />
          )}

          {hashmore && (
            <div className="flex justify-center">
              <button
                onClick={() => setpage((prev) => prev + 1)}
                className="mt-8 rounded-full bg-black hover:bg-gray-800 text-white px-8 py-3 transition-all duration-200"
              >
                Load More
              </button>
            </div>
          )}
        </div>

        <div className="hidden lg:block lg:w-[30%] border-l border-gray-200 pl-8 sticky top-20 h-fit">
          <h2 className="font-bold text-xl mb-4">Trending Topics</h2>
          <div className="flex flex-wrap gap-3">
            {trendingTopics.map((tag) => (
              <Link key={tag} to={`/tag/${encodeURIComponent(tag)}`}>
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-200 font-medium">
                  #{tag}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
