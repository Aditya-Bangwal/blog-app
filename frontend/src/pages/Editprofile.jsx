import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../utils/userslice";

function Editprofile() {
  const dispatch = useDispatch();
  const {
    name,
    email,
    profilepic,
    username,
    bio,
    token,
    id: userId,
  } = useSelector((state) => state.user);

  async function handleupdateprofile() {
    const formData = new FormData();

    formData.append("name", userdata.name);
    formData.append("username", userdata.username);
    if (userdata.profilepic) {
      formData.append("profilepic", userdata.profilepic);
    }
    formData.append("bio", userdata.bio);

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL_USER}/users/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(res);
      //   URL.createObjectURL(blogData.image)

      toast.success(res.data.message);
      dispatch(login({ ...res.data.user, token, email, id: userId }));
      setinitialdata({
        profilepic: res.data.user.profilepic,
        username: res.data.user.username,
        name: res.data.user.name,
        bio: res.data.user.bio,
      });

      //navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  const [isbuttondisabled, setisbuttondisabled] = useState(true);
  const [initialdata, setinitialdata] = useState({
    profilepic,
    username,
    name,
    bio,
  });

  const [userdata, setuserdata] = useState({
    profilepic: profilepic || "",
    username: username || "",
    name: name || "",
    bio: bio || "",
  });

  function handlechange(e) {
    const { value, name, files } = e.target;

    if (files && files.length > 0) {
      setuserdata((prevdata) => ({
        ...prevdata,
        [name]: files[0],
      }));
    } else {
      setuserdata((prevdata) => ({
        ...prevdata,
        [name]: value,
      }));
    }
  }

  useEffect(() => {
    const isequal = JSON.stringify(userdata) === JSON.stringify(initialdata);

    setisbuttondisabled(isequal);
  }, [userdata]);

  return (
    <div className="w-full">
      <div className="md:w-[50%] lg:w-[30%] mx-auto mt-10">
        <h1 className="text-center text-3xl font-bold">Edit Profile</h1>

        <div className="max-w-[700px] mt-5 flex flex-col gap-8 mx-auto">
          {/* Profile Image */}
          <div className="flex items-center gap-5">
            <label htmlFor="image" className="cursor-pointer flex-1">
              {userdata.profilepic ? (
                <img
                  className="rounded-full h-32 w-32 object-cover"
                  src={
                    typeof userdata.profilepic === "string"
                      ? userdata.profilepic
                      : URL.createObjectURL(userdata.profilepic)
                  }
                  alt="Profile"
                />
              ) : (
                <div className="bg-slate-500 h-32 w-32 flex justify-center items-center text-white rounded-full">
                  Select Image
                </div>
              )}
            </label>

            <input
              className="hidden"
              id="image"
              name="profilepic"
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={handlechange}
            />
          </div>

          <button
            onClick={() =>
              setuserdata((prevdata) => ({
                ...prevdata,
                profilepic: null,
              }))
            }
            className="p-2 w-[20%] rounded-2xl cursor-pointer font-bold text-white bg-red-500"
          >
            Remove
          </button>

          <div className="flex items-center gap-5">
            <label className="font-bold w-[120px]">Name :</label>

            <input
              className="border-2 border-black p-2 rounded-md flex-1"
              name="name"
              type="text"
              placeholder="Name"
              defaultValue={userdata.name}
              onChange={handlechange}
            />
          </div>

          <div className="flex items-center gap-5">
            <label className="font-bold w-[120px]">Username :</label>

            <input
              className="border-2 border-black p-2 rounded-md flex-1"
              name="username"
              type="text"
              placeholder="Username"
              defaultValue={userdata.username}
              onChange={handlechange}
            />
          </div>

          <div className="flex items-start gap-5">
            <label className="font-bold w-[120px] pt-2">Bio :</label>

            <textarea
              className="border-2 border-black p-2 rounded-md flex-1 min-h-[120px]"
              name="bio"
              placeholder="Write something..."
              defaultValue={userdata.bio}
              onChange={handlechange}
            />
          </div>

          <h1>{String(isbuttondisabled)}</h1>

          <button
            disabled={isbuttondisabled}
            onClick={handleupdateprofile}
            className={`font-bold  text-white p-3 rounded-md w-[200px] mx-auto ${isbuttondisabled ? " bg-red-200" : "  bg-red-500"}`}
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default Editprofile;
