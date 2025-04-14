import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { FaBug, FaTasks, FaThumbsUp, FaUser } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineDoneAll,
  MdOutlineMessage,
  MdTaskAlt,
} from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import { useParams } from "react-router-dom";

// import { tasks } from "../assets/data";
import Tabs from "../components/Tabs";
import { PRIOTITYSTYELS, TASK_TYPE, getInitials, handleLogout } from "../utils";
import Loading from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { setTasks } from "../redux/slices/taskSlice";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const bgColor = {
  high: "bg-red-200",
  medium: "bg-yellow-200",
  low: "bg-blue-200",
};

const TaskDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const existTask = useSelector((state) =>
    state.tasks.tasks.find((task) => task?._id === id)
  );
  const [task, settask] = useState(existTask);
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (task) {
      return;
    }
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/task/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the headers
        },
        withCredentials: true, // Ensure cookies are sent if needed
      })
      .then((response) => {
        settask(response.data.task);
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
      });
  }, []);

  return (
    <div className="w-full flex flex-col gap-3 mb-4 overflow-y-hidden">
      <h1 className="text-2xl text-gray-600 font-bold">{task?.title}</h1>
      {loading && (
        <div className="absolute top-1/2 left-1/2">
          <Loading />
        </div>
      )}

      <div className="w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow-md p-8 overflow-y-auto">
        {/* LEFT */}
        <div className="w-full md:w-1/2 space-y-8">
          <div className="flex items-center gap-5">
            <div
              className={clsx(
                "flex gap-1 items-center text-base font-semibold px-3 py-1 rounded-full",
                PRIOTITYSTYELS[task?.priority],
                bgColor[task?.priority]
              )}
            >
              <span className="text-lg">{ICONS[task?.priority]}</span>
              <span className="uppercase">{task?.priority} Priority</span>
            </div>

            <div className={clsx("flex items-center gap-2")}>
              <div
                className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task?.stage])}
              />
              <span className="text-black uppercase">{task?.stage}</span>
            </div>
          </div>
          <h4 className="line-clamp-1 text-gray-700 my-4">
            {task?.description}
          </h4>
          <p className="text-gray-500">
            Due Date: {new Date(task?.date).toDateString()}
          </p>
          <p className="text-gray-500">
            Created Date: {new Date(task?.createdAt).toDateString()}
          </p>
        </div>
        {/* RIGHT */}
      </div>
    </div>
  );
};

export default TaskDetails;
