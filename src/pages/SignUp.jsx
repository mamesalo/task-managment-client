import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { useSelector } from "react-redux";
import Loading from "../components/Loader";
import axios from "axios";
import { useSnackbar } from "notistack";

const SignUp = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch("password");
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    setloading(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/user/register`, data, {
        withCredentials: true, // Required to send cookies
      })
      .then((response) => {
        enqueueSnackbar(response.data.message, { variant: "success" });
        navigate("/log-in");
        setloading(false);
      })
      .catch((error) => {
        setloading(false);
        seterror(error.response.data.message);
        console.error(error);
      });
  };

  useEffect(() => {
    user && navigate("/dashboard");
  }, [user]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]">
      <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
        {/* left side */}
        <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
          <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
            <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base bordergray-300 text-gray-600">
              Manage all your to do in one place!
            </span>
            <p className="flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700">
              <span>Cloud-Based</span>
              <span>To-Do Manager</span>
            </p>

            <div className="cell">
              <div className="circle rotate-in-up-left"></div>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14"
          >
            <div className="">
              {/* <p className="text-blue-600 text-3xl font-bold text-center">
                Create an account and start managing your to do in one place.
              </p> */}
              <p className="text-center text-base text-gray-700 ">
                Create an account and start managing your to do in one place.
              </p>
            </div>

            <div className="flex flex-col gap-y-5">
              <Textbox
                placeholder="example"
                type="text"
                name="name"
                label="User Name"
                className="w-full rounded-full"
                register={register("name", {
                  required: "required!",
                  validate: (value) =>
                    value.length > 4 ||
                    "Username must be at least 4 characters",
                })}
                error={errors.name ? errors.name.message : ""}
              />
              <Textbox
                placeholder="email@example.com"
                type="email"
                name="email"
                label="Email Address"
                className="w-full rounded-full"
                register={register("email", {
                  required: "required!",
                })}
                error={errors.email ? errors.email.message : ""}
              />
              <Textbox
                placeholder="your password"
                type="password"
                name="password"
                label="Password"
                className="w-full rounded-full"
                register={register("password", {
                  required: "required!",
                  validate: (value) =>
                    value.length > 5 ||
                    "Password must be at least 6 characters",
                })}
                error={errors.password ? errors.password.message : ""}
              />
              <Textbox
                placeholder="confirm password"
                type="password"
                name="confirm_password"
                label="Confirm Password"
                className="w-full rounded-full"
                register={register("confirm_password", {
                  required: "required!",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                error={
                  errors.confirm_password ? errors.confirm_password.message : ""
                }
              />

              <Link
                to="/log-in"
                className="text-sm text-gray-500 hover:text-blue-600 hover:underline cursor-pointer"
              >
                Already have an account? Sign In
              </Link>

              {loading ? (
                <Loading />
              ) : (
                <Button
                  type="submit"
                  label="Sign Un"
                  className="w-full h-10 bg-blue-700 text-white rounded-full"
                />
              )}
              {error && <p className="text-red-500">{error}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
