import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import { UserAction } from "../components/Dialogs";
import AddUser from "../components/AddUser";
import axios from "axios";
import Loading from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import UserTableRow from "../components/UserTableRow";
import { setTeams } from "../redux/slices/teamSlice";
import { handleLogout } from "../utils";

const Users = () => {
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();

  const token = document.cookie.split("; ");
  const { user } = useSelector((state) => state.auth);
  const { teams } = useSelector((state) => state.teams);

  useEffect(() => {
    if (teams.length != 0) {
      return;
    }
    setloading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/user/get-team`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the headers
        },
        withCredentials: true, // Ensure cookies are sent if needed
      })
      .then((response) => {
        dispatch(setTeams(response.data));
        setloading(false);
      })
      .catch((error) => {
        setloading(false);
        console.error(error);
        if (error.response.statusText == "Unauthorized") {
          handleLogout();
        }
      });
  }, []);

  const userActionHandler = () => {};

  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <tr className="text-black text-left">
        <th className="py-2">Full Name</th>
        <th className="py-2">Title</th>
        <th className="py-2">Email</th>
        <th className="py-2">Role</th>
        <th className="py-2">Active</th>
        <th className="py-2">Admin</th>
      </tr>
    </thead>
  );

  return (
    <div>
      {loading && (
        <div className="absolute top-1/2 left-1/2 translate-x-1/2 translate-y-1/2">
          <Loading />
        </div>
      )}
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="  Team Members" />
          <Button
            label="Add New User"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5"
            onClick={() => setOpen(true)}
          />
        </div>

        <div className="bg-white px-2 md:px-4 py-4 shadow-md rounded">
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              <TableHeader />
              <tbody>
                {teams &&
                  teams
                    .filter((team) => team._id != user._id)
                    .map((user, index) => (
                      <UserTableRow key={user._id} user={user} teams={teams} />
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {open && (
        <AddUser
          teams={teams}
          open={open}
          setOpen={setOpen}
          key={new Date().getTime().toString()}
        />
      )}

      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={userActionHandler}
      />
    </div>
  );
};

export default Users;
