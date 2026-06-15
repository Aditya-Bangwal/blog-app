import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../utils/userslice";
import Input from "../components/Input";
import { googleAuth } from "../utils/firebase";
import googleIcon from "../assets/google-icon-logo-svgrepo-com.svg";

function Authform({ type }) {
  const [userdata, setuserdata] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleregister(e) {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL_USER}/${type}`,
        userdata,
      );

      if (type == "signup") {
        toast.success(res.data.message);
        navigate("/signin");
      } else {
        console.log("LOGIN RESPONSE:", res.data.user);
        console.log("LOGIN RESPONSE:", res.data);
        dispatch(login(res.data.user));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setuserdata({ name: "", email: "", password: "" });
    }
  }

  async function handlegoogleauth() {
    try {
      let data = await googleAuth();

const res = await axios.post(
  `${import.meta.env.VITE_BACKEND_URL_USER}/google-auth`,
  {
    accessToken: data.accessToken,
  }
);

      dispatch(login(res.data.user));
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }
  return (
    <div className="w-full">
      <div className="max-w-[400px] bg-gray-100 p-4 rounded-2xl flex flex-col items-center gap-5 mt-7 -+ mx-auto">
        <h1 className="text-3xl font-bold">
          {type === "signin" ? "Sign in" : "Sign up"}
        </h1>
        <form
          onSubmit={handleregister}
          className="w-[100%] flex flex-col items-center gap-10"
        >
          {type === "signup" && (
            <Input
              className="rounded-full"
              value={userdata.name}
              type={"text"}
              placeholder={"enter name"}
              setuserdata={setuserdata}
              key2={"name"}
              image={"rr-user"}
            />
          )}
          <Input
            className="rounded-full"
            value={userdata.email}
            type={"email"}
            placeholder={"enter email"}
            setuserdata={setuserdata}
            key2={"email"}
            image={"rr-envelope"}
          />
          <Input
            className="rounded-full"
            value={userdata.password}
            type={"password"}
            placeholder={"enter password"}
            setuserdata={setuserdata}
            key2={"password"}
            image={"rr-lock"}
          />
          <button className="w-[100px] bg-blue-500 h-[50px] rounded-md text-white text-xl p-2 focus:outline-none">
            {type == "signin" ? "Log in" : "Register"}
          </button>
          <div className="flex justify-center items-center w-[100%]">
            {type === "signin" ? (
              <div className="flex items-center gap-1">
                <p>Don't have an account?</p>

                <Link to={"/signup"} className="text-blue-600 underline">
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <p>Already have an account?</p>

                <Link to={"/signin"} className="text-blue-600 underline">
                  Sign In
                </Link>
              </div>
            )}
          </div>
          <div
            type="button"
            onClick={handlegoogleauth}
            className="bg-white cursor-pointer hover:bg-blue-100 flex max-w-[75%] p-3 justify-center items-center gap-5 rounded-full"
          >
            <img
              className="w-10 h-10"
              src={googleIcon}
              alt=""
            />
            <div className="font-bold">Sign in with Google</div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Authform;
