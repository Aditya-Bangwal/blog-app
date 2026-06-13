import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { updatedata } from "../utils/userslice";

function Setting() {
  const {
    token,
    id: userId,
    showlikeBlogs,
    showsavedBlogs,
  } = useSelector((slice) => slice.user);
  const navigate = useNavigate();

  const [data, setdata] = useState({
    showlikeBlogs,
    showsavedBlogs,
  });

  const dispatch = useDispatch();

  async function handlevisibility() {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL_USER}/change-saved-liked-blog`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      dispatch(updatedata(data));

      toast.success(res.data.message);
      navigate(-1);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  }

  return token == null ? (
    <Navigate to={"/signin"} />
  ) : (
    <div className="w-full md:w-[500px] ">
      <div className="flex flex-col justify-center gap-2">
        <h1 className="my-4 text-4xl font-bold">Settings</h1>
        <label className="my-5 text-3xl font-bold text-black-500">
          Show Saved Blogs
        </label>

        <select
          // Cast boolean to string so it matches the option values exactly
          value={String(data.showsavedBlogs)}
          onChange={(e) =>
            setdata((prev) => ({
              ...prev,
              showsavedBlogs: e.target.value === "true",
            }))
          }
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition-all duration-200 focus:border-red-500 focus:ring-4 focus:ring-red-100"
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="my-5 text-3xl font-bold text-black-500">
          Show Liked Blogs
        </label>

        <select
          value={String(data.showlikeBlogs)}
          onChange={(e) =>
            setdata((prev) => ({
              ...prev,
              showlikeBlogs: e.target.value === "true",
            }))
          }
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition-all duration-200 focus:border-red-500 focus:ring-4 focus:ring-red-100"
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>

      <div className="flex justify-end mt-4">
        <button
          className="px-8 py-3 rounded-xl bg-red-500 text-white font-semibold shadow-md hover:bg-red-600 active:scale-95 transition-all duration-200"
          onClick={handlevisibility}
        >
          Update
        </button>
      </div>
    </div>
  );
}

export default Setting;
