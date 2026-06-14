import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { handlesaveblog } from "../pages/Blogpage";
import Displayblogs from "../components/Displayblogs";
import Usepagination from "../hooks/Usepagination";

function Searchblogs() {
  const [searchparams] = useSearchParams();
  const { tag } = useParams();

  const [page, setpage] = useState(1);

  const { token, id: userId } = useSelector((slice) => slice.user);

  const q = searchparams.get("q");

  useEffect(() => {
    setpage(1);
  }, [tag, q]);

  const { blogs, hashmore } = Usepagination(
    "search-blogs",
    tag ? { tag } : { search: q },
    1,
    page,
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-10">
        <p className="text-gray-500 uppercase tracking-wider text-sm">
          {tag ? "Tag" : "Search Results"}
        </p>

        <h1 className="text-3xl md:text-4xl font-bold mt-2">
          {tag ? `#${tag}` : q}
        </h1>
      </div>

      {blogs.length > 0 ? (
        <>
          <Displayblogs
            blogs={blogs}
            token={token}
            userId={userId}
            handlesaveblog={handlesaveblog}
          />

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
        </>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold">No blogs found</h2>

          <p className="text-gray-500 mt-2">
            {tag
              ? `No blogs found for "${tag}"`
              : "Try searching with different keywords."}
          </p>
        </div>
      )}
    </div>
  );
}

export default Searchblogs;
