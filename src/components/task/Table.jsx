import React, { useState } from "react";

import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../../utils";
import clsx from "clsx";

import ConfirmatioDialog from "../Dialogs";

import Loading from "../Loader";

import AddTask from "./AddTask";
import moment from "moment";
import TaskDialog from "./TaskDialog";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Table = ({ task }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className=" mt-6">
        <ul className="bg-white shadow-md rounded flex flex-col ">
          <li className="p-4 border-b last:border-b-0 flex flex-col justify-between sm:flex-row sm:items-center relative ">
            {loading && (
              <div className="absolute top-0 left-0 w-full h-full bg-white/50 flex items-center justify-center rounded-md">
                <Loading />
              </div>
            )}
            <div className="absolute top-0 right-0 p-2">
              <TaskDialog task={task} setLoading={setLoading} />
            </div>
            <div>
              <h4
                className={`line-clamp-1 text-black ${
                  task.stage == "completed" && `line-through text-gray-700`
                }  `}
              >
                {task?.title}
              </h4>
              <h4 className="line-clamp-1 text-gray-700 my-4">
                {task?.description}
              </h4>
              <span className="text-sm black">
                {formatDate(new Date(task?.date))}
              </span>
              <div className="flex items-center gap-2  my-3">
                <span className="text-sm text-gray-600">Created Date:</span>
                <span className="text-sm text-gray-600">
                  {moment(task?.createdAt).fromNow()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div
                className={clsx(
                  "flex flex-1 gap-1 items-center text-sm font-medium",
                  PRIOTITYSTYELS[task?.priority]
                )}
              >
                <span className="text-lg">{ICONS[task?.priority]}</span>
                <span className="uppercase">{task?.priority} Priority</span>
              </div>
              <span
                className={`text-sm text-white capitalize px-3 py-2 rounded  ${
                  TASK_TYPE[task?.stage]
                } `}
              >
                {task?.stage}
              </span>
            </div>
          </li>
        </ul>
      </div>

      {/* TODO */}
      {openDialog && (
        <ConfirmatioDialog
          open={openDialog}
          setOpen={setOpenDialog}
          onClick={deleteHandler}
        />
      )}
      {openEditDialog && (
        <AddTask
          open={openEditDialog}
          setOpen={setOpenEditDialog}
          task={selectedTask}
          key={new Date().getTime()}
        />
      )}
    </>
  );
};

export default Table;
