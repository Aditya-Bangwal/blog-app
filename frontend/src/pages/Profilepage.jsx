import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { formatdate } from "../utils/formatdate";
import { useSelector } from "react-redux";
import { handlefollowcreator } from "./Blogpage";
import Displayblogs from "../components/Displayblogs";

function Profilepage() {
  const { username } = useParams();
  const [userdata, setuserdata] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { token, id: userId } = useSelector((state) => state.user);

  useEffect(() => {
    async function fetchuserdetails() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL_USER}/users/${username}`,
        );

        setuserdata(res.data.userid);
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
      }
    }

    if (username) {
      fetchuserdetails();
    }
  }, [username]);

  if (!userdata) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  function rendercomponent() {
    if (location.pathname === `/${username}`) {
      return (
        <Displayblogs blogs={userdata.blogs.filter((blog) => !blog.draft)} />
      );
    } else if (location.pathname === `/${username}/saved-blogs`) {
      return (
        <>
          {userdata.showsavedBlogs || userdata._id === userId ? (
            <Displayblogs blogs={userdata.saveBlogs} />
          ) : (
            <Navigate to={`/${username}`} />
          )}
        </>
      );
    } else if (location.pathname === `/${username}/liked-blogs`) {
      return (
        <>
          {userdata.showlikeBlogs || userdata._id === userId ? (
            <Displayblogs blogs={userdata.likeBlogs} />
          ) : (
            <Navigate to={`/${username}`} />
          )}
        </>
      );
    } else if (location.pathname === `/${username}/draft-blogs`) {
      return (
        <>
          {userdata._id === userId ? (
            <Displayblogs blogs={userdata.blogs.filter((blog) => blog.draft)} />
          ) : (
            <Navigate to={`/${username}`} />
          )}
        </>
      );
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-[70%] order-2 lg:order-1">
          <div className="flex items-center justify-between my-8">
            <h1 className="text-3xl sm:text-4xl font-bold">{userdata.name}</h1>

            <i className="fi fi-tr-square-ellipsis text-xl cursor-pointer"></i>
          </div>

          <nav className="border-b pb-4 mb-6 overflow-x-auto">
            <ul className="flex gap-6 whitespace-nowrap font-medium">
              <li className="cursor-pointer">
                <Link
                  to={`/${username}`}
                  className={`${location.pathname == `/${username}` ? "border-b-2 border-black" : ""} pb-1`}
                >
                  Home
                </Link>
              </li>
              {userdata.showsavedBlogs || userdata._id == userId ? (
                <li className="cursor-pointer">
                  <Link
                    to={`/${username}/saved-blogs`}
                    className={`${location.pathname == `/${username}/saved-blogs` ? "border-b-2 border-black" : ""} pb-1`}
                  >
                    Saved Blogs
                  </Link>
                </li>
              ) : null}

              {userdata.showlikeBlogs || userdata._id == userId ? (
                <li className="cursor-pointer">
                  <Link
                    to={`/${username}/liked-blogs`}
                    className={`${location.pathname == `/${username}/liked-blogs` ? "border-b-2 border-black" : ""} pb-1`}
                  >
                    Liked Blogs
                  </Link>
                </li>
              ) : null}

              <li className="cursor-pointer">
                <Link
                  to={`/${username}/liked-blogs`}
                  className={`${location.pathname == `/${username}/liked-blogs` ? "border-b-2 border-black" : ""} pb-1`}
                >
                  Liked Blogs
                </Link>
              </li>
              {userdata._id == userId ? (
                <li className="cursor-pointer">
                  <Link
                    to={`/${username}/draft-blogs`}
                    className={`${location.pathname == `/${username}/draft-blogs` ? "border-b-2 border-black" : ""} pb-1`}
                  >
                    Draft Blogs
                  </Link>
                </li>
              ) : (
                <Navigate to={`/${username}`} />
              )}
            </ul>
          </nav>

          {rendercomponent()}
        </div>

        <div className="w-full lg:w-[30%] order-1 lg:order-2">
          <div className="lg:sticky lg:top-24 border rounded-xl lg:border-0 lg:border-l border-gray-300 p-5 lg:p-0 lg:pl-8">
            <img
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border"
              src={
                userdata.profilepic
                  ? userdata.profilepic
                  : `https://api.dicebear.com/9.x/initials/svg?seed=${userdata.name}`
              }
              alt=""
            />

            <h2 className="text-2xl font-bold mt-4">{userdata.name}</h2>

            <p className="text-gray-500 mt-2">
              {userdata.followers?.length || 0} Followers
            </p>

            <p className="mt-3 text-gray-700">{userdata.bio}</p>

            {userId === userdata._id ? (
              <Link to="/edit-profile">
                <button className="mt-5 bg-green-700 text-white px-5 py-2 rounded-full font-semibold hover:bg-green-800">
                  Edit Profile
                </button>
              </Link>
            ) : (
              <button
                onClick={() => handlefollowcreator(userdata._id, token)}
                className="mt-5 w-full sm:w-auto bg-green-700 text-white px-5 py-2 rounded-full font-semibold hover:bg-green-800"
              >
                Follow
              </button>
            )}

            <div className="mt-10">
              <h3 className="text-xl font-bold mb-4">Following</h3>

              <div className="space-y-3">
                {userdata.following?.map((user) => (
                  <div
                    key={user._id}
                    className="flex justify-between items-center"
                  >
                    <Link
                      to={`/${user.username}`}
                      className="flex items-center gap-3"
                    >
                      <img
                        className="w-8 h-8 rounded-full border"
                        src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`}
                        alt=""
                      />

                      <p className="font-medium hover:underline">{user.name}</p>
                    </Link>

                    <i className="fi fi-tr-square-ellipsis cursor-pointer"></i>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profilepage;
