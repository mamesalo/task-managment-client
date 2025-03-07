import clsx from "clsx";
import React, { useEffect, useState } from "react";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
} from "react-icons/md";
import Title from "../components/Title";
import Button from "../components/Button";
import { handleLogout, PRIOTITYSTYELS, TASK_TYPE } from "../utils";
import ConfirmatioDialog from "../components/Dialogs";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Loading from "../components/Loader";
import { useSnackbar } from "notistack";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Trash = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("Delete");
  const [selected, setSelected] = useState("");
  const [reloadData, setReloadData] = useState(false);
  const [trashedTask, setTrashedTask] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = document.cookie.split("; ");
  const { enqueueSnackbar } = useSnackbar();

  const deleteAllClick = () => {
    setType("Delete All");
    setMsg("Do you want to permenantly delete all items?");
    setOpenDialog(true);
  };

  const restoreAllClick = () => {
    setType("Restore All");
    setMsg("Do you want to restore all items in the trash?");
    setOpenDialog(true);
  };

  const deleteClick = (id) => {
    setType("Delete");
    setSelected(id);
    setOpenDialog(true);
  };

  const restoreClick = (id) => {
    setSelected(id);
    setType("Restore");
    setMsg("Do you want to restore the selected item?");
    setOpenDialog(true);
  };

  const deleteRestoreHandler = () => {
    switch (type) {
      case "Delete":
        handleDelete();
        break;
      case "Restore":
        handleRestore();
        break;
      case "Delete All":
        handleDeleteAll();
        break;
      case "Restore All":
        handleRestoreAll();
        break;

      default:
        break;
    }
  };
  const handleDelete = () => {
    setLoading(true);
    setOpenDialog(false);
    axios
      .delete(
        `${import.meta.env.VITE_API_URL}/api/task/delete-restore/${selected}`,

        {
          data: { actionType: "delete" },
          headers: {
            Authorization: `Bearer ${token}`,
            // Pass the token in the headers
          },

          withCredentials: true, // Ensure cookies are sent if needed
        }
      )
      .then(() => {
        setReloadData(true);
        enqueueSnackbar(`task deleted successfully `, {
          variant: "success",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);

        setLoading(false);
        if (
          error.response.statusText == "Unauthorized" ||
          error.response.data.statusText == "Unauthorized"
        ) {
          handleLogout();
        }
        console.error(error);
      });
  };
  const handleDeleteAll = () => {
    setLoading(true);
    setOpenDialog(false);
    axios
      .delete(
        `${import.meta.env.VITE_API_URL}/api/task/delete-restore/${selected}`,

        {
          data: { actionType: "deleteAll" },
          headers: {
            Authorization: `Bearer ${token}`,
            // Pass the token in the headers
          },

          withCredentials: true, // Ensure cookies are sent if needed
        }
      )
      .then(() => {
        setReloadData(true);
        enqueueSnackbar(`All tasks Restored successfully `, {
          variant: "success",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);

        setLoading(false);
        if (
          error.response.statusText == "Unauthorized" ||
          error.response.data.statusText == "Unauthorized"
        ) {
          handleLogout();
        }
        console.error(error);
      });
  };
  const handleRestore = () => {
    setLoading(true);
    setOpenDialog(false);
    axios
      .delete(
        `${import.meta.env.VITE_API_URL}/api/task/delete-restore/${selected}`,

        {
          data: { actionType: "restore" },
          headers: {
            Authorization: `Bearer ${token}`,
            // Pass the token in the headers
          },

          withCredentials: true, // Ensure cookies are sent if needed
        }
      )
      .then(() => {
        setReloadData(true);
        enqueueSnackbar(`task Restored successfully `, {
          variant: "success",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);

        setLoading(false);
        if (
          error.response.statusText == "Unauthorized" ||
          error.response.data.statusText == "Unauthorized"
        ) {
          handleLogout();
        }
        console.error(error);
      });
  };
  const handleRestoreAll = () => {
    setLoading(true);
    setOpenDialog(false);
    axios
      .delete(
        `${import.meta.env.VITE_API_URL}/api/task/delete-restore/${selected}`,

        {
          data: { actionType: "restoreAll" },
          headers: {
            Authorization: `Bearer ${token}`,
            // Pass the token in the headers
          },

          withCredentials: true, // Ensure cookies are sent if needed
        }
      )
      .then(() => {
        setReloadData(true);
        enqueueSnackbar(`All tasks Restored successfully `, {
          variant: "success",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);

        setLoading(false);
        if (
          error.response.statusText == "Unauthorized" ||
          error.response.data.statusText == "Unauthorized"
        ) {
          handleLogout();
        }
        console.error(error);
      });
  };
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/task/?isTrashed=true`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the headers
        },
        withCredentials: true, // Ensure cookies are sent if needed
      })
      .then((response) => {
        setTrashedTask(response.data.tasks);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        if (
          error.response.statusText == "Unauthorized" ||
          error.response.data.statusText == "Unauthorized"
        ) {
          handleLogout();
        }
        console.log(error.response.statusText);
      });

    return () => {};
  }, [reloadData]);

  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <tr className="text-black  text-left">
        <th className="py-2">Task Title</th>
        <th className="py-2">Priority</th>
        <th className="py-2">Stage</th>
        <th className="py-2 line-clamp-1">Modified On</th>
      </tr>
    </thead>
  );

  const TableRow = ({ item }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10">
      <td className="py-2">
        <div className="flex items-center gap-2">
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[item.stage])}
          />
          <p className="w-full line-clamp-2 text-base text-black">
            {item?.title}
          </p>
        </div>
      </td>

      <td className="py-2 capitalize">
        <div className={"flex gap-1 items-center"}>
          <span className={clsx("text-lg", PRIOTITYSTYELS[item?.priority])}>
            {ICONS[item?.priority]}
          </span>
          <span className="">{item?.priority}</span>
        </div>
      </td>

      <td className="py-2 capitalize text-center md:text-start">
        {item?.stage}
      </td>
      <td className="py-2 text-sm">{new Date(item?.date).toDateString()}</td>

      <td className="py-2 flex gap-1 justify-end">
        <Button
          icon={<MdOutlineRestore className="text-xl text-gray-500" />}
          onClick={() => restoreClick(item._id)}
        />
        <Button
          icon={<MdDelete className="text-xl text-red-600" />}
          onClick={() => deleteClick(item._id)}
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="Trashed Tasks" />

          {trashedTask.length > 0 && (
            <div className="flex gap-2 md:gap-4 items-center">
              <Button
                label="Restore All"
                icon={<MdOutlineRestore className="text-lg hidden md:flex" />}
                className="flex flex-row-reverse gap-1 items-center  text-black text-sm md:text-base rounded-md 2xl:py-2.5"
                onClick={() => restoreAllClick()}
              />
              <Button
                label="Delete All"
                icon={<MdDelete className="text-lg hidden md:flex" />}
                className="flex flex-row-reverse gap-1 items-center  text-red-600 text-sm md:text-base rounded-md 2xl:py-2.5"
                onClick={() => deleteAllClick()}
              />
            </div>
          )}
        </div>
        <div className="bg-white px-2 md:px-6 py-4 shadow-md rounded">
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              <TableHeader />

              <tbody>
                {loading && (
                  <div className="absolute top-1/2 left-1/2">
                    <Loading />
                  </div>
                )}
                {trashedTask
                  ?.filter((item) => item.isTrashed == true)
                  .map((tk, id) => (
                    <TableRow key={id} item={tk} />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* <AddUser open={open} setOpen={setOpen} /> */}

      {openDialog && (
        <ConfirmatioDialog
          open={openDialog}
          setOpen={setOpenDialog}
          msg={msg}
          setMsg={setMsg}
          type={type}
          setType={setType}
          onClick={() => deleteRestoreHandler()}
        />
      )}
    </>
  );
};

export default Trash;
