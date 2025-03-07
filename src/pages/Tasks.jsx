import React, { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView, MdOutlineSearch } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import BoardView from "../components/BoardView";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "../redux/slices/taskSlice";
import { handleLogout } from "../utils";

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
  const { user } = useSelector((state) => state.auth);
  const [selected, setSelected] = useState(0);
  const [reloadData, setReloadData] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { tasks } = useSelector((state) => state.tasks);

  const token = document.cookie.split("; ");
  const dispatch = useDispatch();
  const status = params?.status || "";
  const [filter, setfilter] = useState(status);

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
  useEffect(() => {
    setfilter(status);
  }, [status]);

  return (
    <div className="w-full">
      {!status && tasks?.length > 0 && (
        <div className="w-64 2xl:w-[400px] flex items-center py-2 px-3 gap-2 rounded-full bg-white">
          <MdOutlineSearch className="text-gray-500 text-xl" />

          <input
            type="text"
            placeholder="Search...."
            className="flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800"
          />
        </div>
      )}
      <div className="flex items-center justify-between mb-4 mt-4">
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        {!status && user.isAdmin && (
          <Button
            onClick={() => setOpen(true)}
            label="Create Task"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
          />
        )}
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {!status && (
          <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
            <button className={`w-full`} onClick={() => setfilter("")}>
              <TaskTitle
                label="All"
                bgClassName={`${filter == "" && `bg-blue-300`}`}
              />
            </button>
            <button className="w-full" onClick={() => setfilter("todo")}>
              <TaskTitle
                label="To Do"
                className={TASK_TYPE.todo}
                bgClassName={`${filter == "todo" && `bg-blue-300`}`}
              />
            </button>
            <button className="w-full" onClick={() => setfilter("in progress")}>
              <TaskTitle
                label="In Progress"
                className={TASK_TYPE["in progress"]}
                bgClassName={`${filter == "in progress" && `bg-blue-300`}`}
              />
            </button>
            <button className="w-full" onClick={() => setfilter("completed")}>
              <TaskTitle
                label="completed"
                className={TASK_TYPE.completed}
                bgClassName={`${filter == "completed" && `bg-blue-300`}`}
              />
            </button>
          </div>
        )}
        {loading && (
          <div className="py-10 absolute top-1/2 left-1/2">
            <Loading />
          </div>
        )}
        {selected !== 1 ? (
          <BoardView
            tasks={tasks}
            setReloadData={setReloadData}
            filter={filter}
          />
        ) : (
          <div className="w-full">
            <Table
              tasks={tasks}
              setReloadData={setReloadData}
              filter={filter}
            />
          </div>
        )}
      </Tabs>

      {open && <AddTask open={open} setOpen={setOpen} />}
    </div>
  );
};

export default Tasks;
