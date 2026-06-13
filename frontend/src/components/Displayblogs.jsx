import React from "react";
import { Link } from "react-router-dom";
import { formatdate } from "../utils/formatdate";

function Displayblogs({ blogs, token, userId, handlesaveblog }) {
  return (
    <div className="w-full">
      {blogs.length > 0 ? (
        blogs?.map((blog) => (
          <Link key={blog._id} to={`/blog/${blog.blogId}`}>
            <article className="w-full my-8 border-b border-gray-200 pb-8 hover:bg-gray-50 rounded-2xl p-3 transition-all duration-200">
              <div className="flex flex-col-reverse md:flex-row gap-5 justify-between">
                {/* Left */}
                <div className="w-full md:w-[65%] flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={blog?.creator?.profilepic}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <p className="font-medium text-sm">{blog?.creator?.name}</p>
                  </div>

                  <h2 className="font-bold text-xl md:text-2xl leading-tight">
                    {blog?.title}
                  </h2>

                  <p className="text-gray-600 line-clamp-3">
                    {blog?.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-5 text-gray-600 mt-2">
                    <p>{formatdate(blog?.createdAt)}</p>

                    <div className="cursor-pointer flex items-center gap-1">
                      <i className="fi fi-sr-thumbs-up text-red-500"></i>
                      <p>{blog?.likes?.length || 0}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <i className="fi fi-sr-comment-alt"></i>
                      <p>{blog?.comments?.length || 0}</p>
                    </div>

                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        handlesaveblog(blog?._id, token);
                      }}
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      {blog?.totalsaves?.includes(userId) ? (
                        <i className="fi fi-sr-bookmark"></i>
                      ) : (
                        <i className="fi fi-rr-bookmark"></i>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="w-full md:w-[35%]">
                  <img
                    src={blog?.imageurl}
                    alt={blog?.title}
                    className="w-full h-[220px] md:h-[180px] object-cover rounded-2xl shadow-sm"
                  />
                </div>
              </div>
            </article>
          </Link>
        ))
      ) : (
        <h1 className="text-4xl font-extrabold">No data found</h1>
      )}
    </div>
  );
}

export default Displayblogs;
