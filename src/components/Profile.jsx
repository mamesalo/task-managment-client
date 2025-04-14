import { useForm } from "react-hook-form";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Button from "./Button";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useState } from "react";
import ModalWrapper from "./ModalWrapper";
import Loading from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import { updateuser } from "../redux/slices/authSlice";
import { handleLogout } from "../utils";

const Profile = ({ open, setOpen }) => {
  const { token, user } = useSelector((state) => state.auth); // Get user data from Redux
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  console.log(user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const handleOnSubmit = (data) => {
    setLoading(true);
    console.log(data);

    axios
      .put(
        `${import.meta.env.VITE_API_URL}/api/user/update-profile`,
        { ...data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )
      .then(() => {
        setLoading(false);
        setOpen(false);
        dispatch(updateuser({ name: data.name }));
        enqueueSnackbar("Profile updated successfully!", {
          variant: "success",
        });
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        enqueueSnackbar(
          `error while updating profile ${error.response.data.message} `,
          { variant: "error" }
        );
        if (
          error.response.statusText == "Unauthorized" ||
          error.response.data.statusText == "Unauthorized"
        ) {
          handleLogout();
          enqueueSnackbar(`Unauthorized, Action`, { variant: "error" });
        }
      });
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)} className="">
        <Dialog.Title
          as="h2"
          className="text-base font-bold text-gray-900 mb-4"
        >
          Update Profile
        </Dialog.Title>
        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Username"
            type="text"
            name="name"
            label="Username"
            className="w-full rounded"
            register={register("name", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "At least 3 characters required",
              },
            })}
            error={errors.name ? errors.name.message : ""}
          />
          <Textbox
            placeholder="Email"
            disabled={true}
            type="email"
            name="email"
            label="Email"
            className="w-full rounded"
            register={register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Enter a valid email",
              },
            })}
            error={errors.email ? errors.email.message : ""}
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
  );
};

export default Profile;
