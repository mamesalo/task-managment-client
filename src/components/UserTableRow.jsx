import React, { useState } from "react";
import Button from "./Button";
import { getInitials, handleLogout } from "../utils";
import clsx from "clsx";
import { useSnackbar } from "notistack";
import axios from "axios";
import AddUser from "./AddUser";
import Loading from "./Loader";
import { useDispatch } from "react-redux";
import { setTeams } from "../redux/slices/teamSlice";
import ConfirmatioDialog from "./Dialogs";

const UserTableRow = ({ user, teams }) => {
  const [loading, setloading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const token = document.cookie.split("; ");
  const dispatch = useDispatch();

  const deleteClick = (id) => {
    setOpenDialog(true);
  };
  const deleteHandler = () => {
    setloading(true);
    setOpenDialog(false);
    axios
      .delete(
        `${import.meta.env.VITE_API_URL}/api/user/${user._id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Pass the token in the headers
          },

          withCredentials: true, // Ensure cookies are sent if needed
        }
      )
      .then(() => {
        const updatedTeam = teams.filter((team) => team._id != user._id);
        dispatch(setTeams(updatedTeam));
        enqueueSnackbar(`user deleted successfully `, { variant: "success" });
        setloading(false);
      })
      .catch((error) => {
        setloading(false);
        console.error(error);
        if (error.response.statusText == "Unauthorized") {
          handleLogout();
        }
      });
  };
  const userStatusClick = () => {
    setloading(true);
    axios
      .put(
        `${import.meta.env.VITE_API_URL}/api/user/${user._id}`,
        {
          isActive: !user.isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Pass the token in the headers
          },

          withCredentials: true, // Ensure cookies are sent if needed
        }
      )
      .then(() => {
        const updatedTeam = teams.map((team) =>
          team._id == user._id ? { ...team, isActive: !user.isActive } : team
        );
        dispatch(setTeams(updatedTeam));
        enqueueSnackbar(
          `user ${user.isActive ? `Deactivated` : `Activated`} successfully `,
          { variant: "success" }
        );
        setloading(false);
      })
      .catch((error) => {
        setloading(false);
        console.error(error);
        if (error.response.statusText == "Unauthorized") {
          handleLogout();
        }
      });
  };
  const editClick = () => {
    setOpen(true);
  };
  return (
    <>
      {loading && (
        <div className="absolute top-1/2 left-1/2 translate-x-1/2 translate-y-1/2">
          <Loading />
        </div>
      )}
      <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10">
        <td className="p-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700">
              <span className="text-xs md:text-sm text-center uppercase">
                {getInitials(user.name)}
              </span>
            </div>
            {user.name}
          </div>
        </td>

        <td className="p-2">{user.title}</td>
        <td className="p-2">{user.email || "user.emal.com"}</td>
        <td className="p-2">{user.role}</td>

        <td>
          <button
            disabled={loading}
            onClick={userStatusClick}
            className={clsx(
              "w-fit px-4 py-1 rounded-full",
              user?.isActive ? "bg-blue-200" : "bg-yellow-100"
            )}
          >
            {user?.isActive ? "Active" : "Disabled"}
          </button>
        </td>
        <td>{user.isAdmin && "✅"}</td>

        <td className="p-2 flex gap-4 justify-end">
          <Button
            disabled={loading}
            className="text-blue-600 hover:text-blue-500 font-semibold sm:px-0"
            label="Edit"
            type="button"
            onClick={editClick}
          />

          <Button
            disabled={loading}
            className="text-red-700 hover:text-red-500 font-semibold sm:px-0"
            label="Delete"
            type="button"
            onClick={() => deleteClick(user._id)}
          />
        </td>
      </tr>

      {open && (
        <AddUser
          teams={teams}
          open={open}
          setOpen={setOpen}
          userData={user}
          key={new Date().getTime().toString()}
        />
      )}
      {openDialog && (
        <ConfirmatioDialog
          open={openDialog}
          setOpen={setOpenDialog}
          onClick={deleteHandler}
        />
      )}
    </>
  );
};

export default UserTableRow;
