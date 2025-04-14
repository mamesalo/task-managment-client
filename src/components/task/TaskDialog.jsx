import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiTwotoneFolderOpen } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { HiDuplicate } from "react-icons/hi";
import { MdAdd, MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Menu, Transition } from "@headlessui/react";
import AddTask from "./AddTask";
import ConfirmatioDialog from "../Dialogs";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "../../redux/slices/taskSlice";
import axios from "axios";
import { VscDebugStart } from "react-icons/vsc";
import { handleLogout } from "../../utils";
import { IoMdDoneAll, IoMdPause } from "react-icons/io";

const TaskDialog = ({ task, setLoading }) => {
  const { token } = useSelector((state) => state.auth);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { tasks } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const handleStageChange = (stage) => {
    setLoading(true);
    axios
      .put(
        `${import.meta.env.VITE_API_URL}/api/task/update_stage/${task._id}`,
        {
          stage,
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
        const updatedTask = tasks.map((item) =>
          item._id == task._id ? { ...item, stage: stage } : item
        );
        dispatch(setTasks(updatedTask));
        enqueueSnackbar(`Task stage changed successfully `, {
          variant: "success",
        });
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        enqueueSnackbar(
          `error while updating ${error.response.data.message} `,
          { variant: "error" }
        );
        if (
          error.response.statusText == "Unauthorized" ||
          error.response.data.statusText == "Unauthorized"
        ) {
          handleLogout();
        }
      });
  };

  const deleteHandler = () => {
    setLoading(true);
    setOpenDialog(false);
    axios
      .delete(
        `${import.meta.env.VITE_API_URL}/api/task/delete/${task._id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Pass the token in the headers
          },

          withCredentials: true, // Ensure cookies are sent if needed
        }
      )
      .then(() => {
        const updatedTask = tasks.filter((item) => item._id != task._id);
        dispatch(setTasks(updatedTask));
        enqueueSnackbar(`task removed to trash successfully `, {
          variant: "success",
        });
        setLoading(false);
      })
      .catch((error) => {
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

  const items = [
    {
      label: "Open Task",
      icon: <AiTwotoneFolderOpen className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => navigate(`/task/${task._id}`),
    },
    {
      label: "Edit",
      icon: <MdOutlineEdit className="mr-2 h-5 w-5" aria-hidden="true" />,
      onClick: () => setOpenEdit(true),
    },
  ];

  return (
    <>
      <div>
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-600 ">
            <BsThreeDots />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute z-20 p-4 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="px-1 py-1 space-y-2">
                {items.map((el) => (
                  <Menu.Item key={el.label}>
                    {({ active }) => (
                      <button
                        onClick={el?.onClick}
                        className={`${
                          active ? "bg-blue-500 text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        {el.icon}
                        {el.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>

              {task.stage != "in progress" && (
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => handleStageChange("in progress")}
                        className={`${
                          active ? "bg-blue-500 text-white" : "text-blue-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <VscDebugStart
                          className="mr-2 h-5 w-5 text-blue-400"
                          aria-hidden="true"
                        />
                        {task.stage == "completed"
                          ? "Restart Task"
                          : "Start Task"}
                      </button>
                    )}
                  </Menu.Item>
                </div>
              )}
              {task.stage == "in progress" && (
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => handleStageChange("todo")}
                        className={`${
                          active ? "bg-blue-500 text-white" : "text-blue-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <IoMdPause
                          className="mr-2 h-5 w-5 text-blue-400"
                          aria-hidden="true"
                        />
                        Pause Task
                      </button>
                    )}
                  </Menu.Item>
                </div>
              )}
              {task.stage != "completed" && (
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => handleStageChange("completed")}
                        className={`${
                          active ? "bg-blue-500 text-white" : "text-green-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <IoMdDoneAll
                          className="mr-2 h-5 w-5 text-green-400"
                          aria-hidden="true"
                        />
                        Complete Task
                      </button>
                    )}
                  </Menu.Item>
                </div>
              )}

              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => deleteHandler()}
                      className={`${
                        active ? "bg-blue-500 text-white" : "text-red-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      <RiDeleteBin6Line
                        className="mr-2 h-5 w-5 text-red-400"
                        aria-hidden="true"
                      />
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {openEdit && (
        <AddTask
          open={openEdit}
          setOpen={setOpenEdit}
          task={task}
          key={new Date().getTime()}
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

export default TaskDialog;
