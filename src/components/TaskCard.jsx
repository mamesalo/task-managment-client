import clsx from "clsx";
import React, { useState } from "react";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../utils";
import TaskDialog from "./task/TaskDialog";

import Loading from "./Loader";
import moment from "moment";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }) => {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className="w-full h-fit bg-white shadow-md p-4 rounded relative">
        {loading && (
          <div className="absolute top-0 left-0 w-full h-full bg-white/50 flex items-center justify-center rounded-md">
            <Loading />
          </div>
        )}
        <div className="w-full flex justify-between">
          <div
            className={clsx(
              "flex flex-1 gap-1 items-center text-sm font-medium",
              PRIOTITYSTYELS[task?.priority]
            )}
          >
            <span className="text-lg">{ICONS[task?.priority]}</span>
            <span className="uppercase">{task?.priority} Priority</span>
          </div>

          <TaskDialog task={task} setLoading={setLoading} />
        </div>

        <>
          <div className="flex items-center gap-2">
            <div
              className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])}
            />
            <h4
              className={`line-clamp-1 text-black ${
                task.stage == "completed" && `line-through text-gray-700`
              }  `}
            >
              {task?.title}
            </h4>
          </div>
          <h4 className="line-clamp-1 text-gray-700 my-4">
            {task?.description}
          </h4>
          <span className="text-sm text-gray-600">
            {formatDate(new Date(task?.date))}
          </span>
        </>

        <div className="w-full border-t border-gray-200 my-2" />
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center justify-between gap-3 w-full">
            <span className="text-sm text-gray-600">
              {moment(task?.createdAt).fromNow()}
            </span>
            <span
              className={`text-sm text-white capitalize px-3 py-2 rounded  ${
                TASK_TYPE[task?.stage]
              } `}
            >
              {task?.stage}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskCard;
