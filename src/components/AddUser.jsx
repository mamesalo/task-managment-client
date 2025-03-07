import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";
import { useSnackbar } from "notistack";
import axios from "axios";
import { setTeams } from "../redux/slices/teamSlice";
import { handleLogout } from "../utils";
const AddUser = ({ open, setOpen, userData, teams }) => {
  let defaultValues = userData ?? {};

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);
  const token = document.cookie.split("; ");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });
  const password = watch("password");

  const handleOnSubmit = (data) => {
    userData ? handleUpdate(data) : handleAdd(data);
  };

  const handleUpdate = (data) => {
    setisLoading(true);
    axios
      .put(
        `${import.meta.env.VITE_API_URL}/api/user/profile`,
        {
          ...data,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Pass the token in the headers
          },

          withCredentials: true, // Ensure cookies are sent if needed
        }
      )
      .then((response) => {
        const updatedTeam = teams.map((team) =>
          team._id == response.data.user._id ? response.data.user : team
        );
        dispatch(setTeams(updatedTeam));
        setisLoading(false);
        setOpen(false);
        enqueueSnackbar(response.data.message, { variant: "success" });
      })
      .catch((error) => {
        setisLoading(false);
        console.error(error);
        enqueueSnackbar(
          `error while updating ${error.response.data.message} `,
          { variant: "error" }
        );
        if (error.response.statusText == "Unauthorized") {
          handleLogout();
        }
      });
  };
  const handleAdd = (data) => {
    setisLoading(true);
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/user/register`,
        { ...data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Pass the token in the headers
          },

          withCredentials: true, // Ensure cookies are sent if needed
        }
      )
      .then((response) => {
        dispatch(setTeams([response.data, ...teams]));
        setisLoading(false);
        setOpen(false);
        enqueueSnackbar("User Added Succesfully", { variant: "success" });
      })
      .catch((error) => {
        setisLoading(false);
        console.error(error);
        enqueueSnackbar(
          `error while registering ${error.response.data.message} `,
          { variant: "error" }
        );
        if (error.response.statusText == "Unauthorized") {
          handleLogout();
        }
      });
  };
  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {userData ? "UPDATE PROFILE" : "ADD NEW USER"}
          </Dialog.Title>

          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Full name"
              type="text"
              name="name"
              label="Full Name"
              className="w-full rounded"
              register={register("name", {
                required: "Full name is required!",
              })}
              error={errors.name ? errors.name.message : ""}
            />
            <Textbox
              placeholder="Title"
              type="text"
              name="title"
              label="Title"
              className="w-full rounded"
              register={register("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
            />
            <Textbox
              placeholder="Email Address"
              type="email"
              name="email"
              label="Email Address"
              className="w-full rounded"
              register={register("email", {
                required: "Email Address is required!",
              })}
              error={errors.email ? errors.email.message : ""}
            />

            <Textbox
              placeholder="Role"
              type="text"
              name="role"
              label="Role"
              className="w-full rounded"
              register={register("role", {
                required: "User role is required!",
              })}
              error={errors.role ? errors.role.message : ""}
            />
            <div className="flex items-center mb-4">
              <input
                {...register("isAdmin")}
                defaultChecked={defaultValues && defaultValues.isAdmin}
                id="isAdmin"
                type="checkbox"
                name="isAdmin"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm ring-blue-500 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 "
              />
              <label
                htmlFor="isAdmin"
                className="ms-2 text-sm font-medium text-slate-800"
              >
                Is Admin
              </label>
            </div>
            {!userData && (
              <>
                <Textbox
                  placeholder="Password"
                  type="password"
                  name="password"
                  label="Password"
                  className="w-full rounded"
                  register={register("password", {
                    required: "User password is required!",
                  })}
                  error={errors.password ? errors.password.message : ""}
                />
                <Textbox
                  placeholder="Confirm Password"
                  type="password"
                  name="confirm_password"
                  label="Confirm Password"
                  className="w-full rounded"
                  register={register("confirm_password", {
                    required: "confirm password is required!",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  error={
                    errors.confirm_password
                      ? errors.confirm_password.message
                      : ""
                  }
                />
              </>
            )}
          </div>

          {isLoading ? (
            <div className="py-5">
              <Loading />
            </div>
          ) : (
            <div className="py-3 mt-4 sm:flex sm:flex-row-reverse">
              <Button
                type="submit"
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
                label="Submit"
              />

              <Button
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpen(false)}
                label="Cancel"
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddUser;
