import { useForm } from "react-hook-form";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Button from "./Button";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { handleLogout } from "../utils";
import ModalWrapper from "./ModalWrapper";
import Loading from "./Loader";

const Changepassword = ({ open, setOpen }) => {
  const token = document.cookie.split("; ");
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch("password");

  // const [addSbTask] = useCreateSubTaskMutation();

  // const handleOnSubmit = async (data) => {
  // try {
  //   const res = await addSbTask({ data, id }).unwrap();
  //   toast.success(res.message);
  //   setTimeout(() => {
  //     setOpen(false);
  //   }, 500);
  // } catch (err) {
  //   console.log(err);
  //   toast.error(err?.data?.message || err.error);
  // }
  // };

  const handleOnSubmit = (data) => {
    console.log(data);
    setLoading(true);
    axios
      .put(
        `${import.meta.env.VITE_API_URL}/api/user/change-password/`,
        { password: data.password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Pass the token in the headers
          },

          withCredentials: true, // Ensure cookies are sent if needed
        }
      )
      .then(() => {
        setLoading(false);
        setOpen(false);
        enqueueSnackbar("Password Changed Succesfully pls login in again", {
          variant: "success",
        });
        setTimeout(() => {
          handleLogout();
        }, 4000);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        enqueueSnackbar(
          `error while Create Sub Task ${error.response.data.message} `,
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
        <form onSubmit={handleSubmit(handleOnSubmit)} className="">
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            Change Password
          </Dialog.Title>
          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="password"
              type="password"
              name="password"
              label="Password"
              className="w-full rounded"
              register={register("password", {
                required: "required!",
              })}
              error={errors.password ? errors.password.message : ""}
            />
            <Textbox
              placeholder="confirm password"
              type="password"
              name="confirm_password"
              label="Confirm Password"
              className="w-full rounded"
              register={register("confirm_password", {
                required: "required!",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              error={
                errors.confirm_password ? errors.confirm_password.message : ""
              }
            />
          </div>
          {loading ? (
            <Loading />
          ) : (
            <div className="py-3 mt-4 flex sm:flex-row-reverse gap-4">
              <Button
                type="submit"
                className="bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 sm:ml-3 sm:w-auto"
                label="Save"
              />

              <Button
                type="button"
                className="bg-white border text-sm font-semibold text-gray-900 sm:w-auto"
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

export default Changepassword;
