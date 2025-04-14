import React, { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView, MdOutlineSearch } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";

import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "../redux/slices/taskSlice";
import { handleLogout } from "../utils";
import TaskCard from "../components/TaskCard";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const Tasks = () => {
  const params = useParams();
  const [selected, setSelected] = useState(0);
  const [reloadData, setReloadData] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { tasks } = useSelector((state) => state.tasks);
  const { token } = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const dispatch = useDispatch();
  const status = params?.status || "";

  const filterFun = (task) => {
    if (status === "completed") {
      return (
        task.stage === "completed" &&
        task.title.toLowerCase().includes(search.trim()) &&
        task.priority.includes(priorityFilter)
      );
    } else if (status === "in-progress") {
      return (
        task.stage === "in progress" &&
        task.title.toLowerCase().includes(search.trim()) &&
        task.priority.includes(priorityFilter)
      );
    } else if (status === "todo") {
      return (
        task.stage === "todo" &&
        task.title.toLowerCase().includes(search.trim()) &&
        task.priority.includes(priorityFilter)
      );
    } else if (status === "today") {
      const today = new Date().toISOString().split("T")[0];
      return (
        task.date.split("T")[0] === today &&
        task.title.toLowerCase().includes(search.trim()) &&
        task.priority.includes(priorityFilter)
      );
    } else {
      return (
        task.title.toLowerCase().includes(search.trim()) &&
        task.priority.includes(priorityFilter)
      );
    }
  };

  const sortFun = (a, b) => {
    if (sortOrder === "asc") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  };
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/task/`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the headers
        },
        withCredentials: true, // Ensure cookies are sent if needed
      })
      .then((response) => {
        dispatch(setTasks(response.data.tasks));
        setLoading(false);
        setReloadData(false);
      })
      .catch((error) => {
        setLoading(false);
        setReloadData(false);
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

  return (
    <div className="w-full">
      {tasks?.length > 0 && (
        <div className="w-64 2xl:w-[400px] flex items-center py-2 px-3 gap-2 rounded-full bg-white">
          <MdOutlineSearch className="text-gray-500 text-xl" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search...."
            className="flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800"
          />
        </div>
      )}
      <div className="flex items-center justify-between mb-4 mt-4">
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        <Button
          onClick={() => setOpen(true)}
          label="Create Task"
          icon={<IoMdAdd className="text-lg" />}
          className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
        />
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        <div className="flex space-x-4 mb-4">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="normal">Normal</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="desc">Date Descending</option>
            <option value="asc">Date Ascending</option>
          </select>
        </div>

        {loading && (
          <div className="py-10 absolute top-1/2 left-1/2">
            <Loading />
          </div>
        )}
        {selected !== 1 ? (
          <div className="w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10">
            {tasks
              .filter(filterFun)
              .sort(sortFun)
              .map((task) => (
                <TaskCard task={task} key={task._id} />
              ))}
          </div>
        ) : (
          <div className=" mt-6">
            <ul className="bg-white shadow-md rounded flex flex-col ">
              {tasks
                .filter(filterFun)
                .sort(sortFun)
                .map((task) => (
                  <Table task={task} key={task._id} />
                ))}
            </ul>
          </div>
        )}
      </Tabs>

      {open && <AddTask open={open} setOpen={setOpen} />}
    </div>
  );
};

export default Tasks;
