import React, { useEffect, useState } from "react";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { LuClipboardEdit } from "react-icons/lu";
import { FaNewspaper } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import moment from "moment";
import clsx from "clsx";
import { Chart } from "../components/Chart";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, handleLogout } from "../utils";
import UserInfo from "../components/UserInfo";
import { useSelector } from "react-redux";
import Loading from "../components/Loader";
import axios from "axios";

const TaskTable = ({ tasks }) => {
  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-300 ">
      <tr className="text-black text-left">
        <th className="py-2">Task Title</th>
        <th className="py-2">Priority</th>
        <th className="py-2 hidden md:block">Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => (
    <tr className="border-b border-gray-300 text-gray-600 hover:bg-gray-300/10">
      <td className="py-2">
        <div className="flex items-center gap-2">
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])}
          />

          <p className="text-base text-black">{task.title}</p>
        </div>
      </td>

      <td className="py-2">
        <div className="flex gap-1 items-center">
          <span className={clsx("text-lg", PRIOTITYSTYELS[task.priority])}>
            {ICONS[task.priority]}
          </span>
          <span className="capitalize">{task.priority}</span>
        </div>
      </td>

      <td className="py-2 hidden md:block">
        <span className="text-base text-gray-600">
          {moment(task?.date).fromNow()}
        </span>
      </td>
    </tr>
  );
  return (
    <div className="w-full md:w-2/3 bg-white px-2 md:px-4 pt-4 pb-4 shadow-md rounded">
      <table className="w-full">
        <TableHeader />
        <tbody>
          {tasks?.map((task, id) => (
            <TableRow key={id} task={task} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Dashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [dasboardData, setDasboardData] = useState({
    totalTasks: 0,
    last10Task: [],
    tasks: {
      todo: 0,
      "in progress": 0,
      completed: 0,
    },
    chartData: [],
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/task/dashboard/`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the headers
        },
        withCredentials: true, // Ensure cookies are sent if needed
      })
      .then((response) => {
        console.log(response);
        setLoading(false);
        setDasboardData({
          totalTasks: response.data.totalTasks || 0,
          last10Task: response.data.last10Task || [],
          tasks: {
            todo: response.data.tasks["todo"] || 0,
            "in progress": response.data.tasks["in progress"] || 0,
            completed: response.data.tasks["completed"] || 0,
          },
          chartData: response.data.chartData || [],
        });
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        console.log(error.response.data.statusText == "Unauthorized");
        if (
          error.response.statusText == "Unauthorized" ||
          error.response.data.statusText == "Unauthorized"
        ) {
          handleLogout();
        }
        console.log(error.response.statusText);
      });
  }, []);
  const stats = [
    {
      _id: "1",
      label: "TOTAL TASK",
      total: dasboardData?.totalTasks || 0,
      icon: <FaNewspaper />,
      bg: "bg-[#1d4ed8]",
    },
    {
      _id: "2",
      label: "COMPLTED TASK",
      total: ["completed"] || 0,
      icon: <MdAdminPanelSettings />,
      bg: "bg-[#0f766e]",
    },
    {
      _id: "3",
      label: "TASK IN PROGRESS ",
      total: ["in progress"] || 0,
      icon: <LuClipboardEdit />,
      bg: "bg-[#f59e0b]",
    },
    {
      _id: "4",
      label: "TODOS",
      total: ["todo"] || 0,
      icon: <FaArrowsToDot />,
      bg: "bg-[#be185d]" || 0,
    },
  ];

  const Card = ({ label, count, bg, icon }) => {
    return (
      <div className="w-full h-32 bg-white p-5 shadow-md rounded-md flex items-center justify-between">
        <div className="h-full flex flex-1 flex-col justify-between">
          <p className="text-base text-gray-600">{label}</p>
          <span className="text-lg font-semibold">{count}</span>
        </div>

        <div
          className={clsx(
            "w-10 h-10 rounded-full flex items-center justify-center text-white",
            bg
          )}
        >
          {icon}
        </div>
      </div>
    );
  };
  return (
    <div classNamee="h-full py-4">
      {loading && (
        <div className="absolute top-1/2 left-1/2 z-30">
          <Loading />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {stats.map(({ icon, bg, label, total }, index) => (
          <Card key={index} icon={icon} bg={bg} label={label} count={total} />
        ))}
      </div>
      <div className="w-full bg-white my-16 p-4 rounded shadow-sm">
        <h4 className="text-xl text-gray-600 font-semibold">
          Chart by Priority
        </h4>
        <Chart data={dasboardData.chartData} />
      </div>{" "}
      <h3 className="text-xl font-semibold">Recent Tasks</h3>
      <div className="w-full flex flex-col md:flex-row gap-4 2xl:gap-10 py-8">
        {/* /left */}
        <TaskTable tasks={dasboardData.last10Task} />
      </div>
    </div>
  );
};

export default Dashboard;
