import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "../SelectList";
import Button from "../Button";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../Loader";
import axios from "axios";
import { setTasks } from "../../redux/slices/taskSlice";
import { handleLogout } from "../../utils";

const LISTS = ["TODO", "IN PROGRESS"];
const PRIORIRY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ open, setOpen, task }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [team, setTeam] = useState(task ? task.team : []);
  const [stage, setStage] = useState(task ? task.stage : LISTS[0]);
  const [priority, setPriority] = useState(task ? task.priority : PRIORIRY[2]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const { teams } = useSelector((state) => state.teams); //from redux
  const token = document.cookie.split("; ");

  const handleAddtask = (data) => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/task/create`,
        { ...data, stage, priority, team },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Pass the token in the headers
          },

          withCredentials: true, // Ensure cookies are sent if needed
        }
      )
      .then((response) => {
        let data = response.data.task;
        let teamField = data.team;
        let newTeamField = teamField.map((id) =>
          teams.find((singleTeam) => id == singleTeam._id)
        );

        data.team = newTeamField;
        dispatch(setTasks([data, ...tasks]));
        setLoading(false);
        setOpen(false);
        enqueueSnackbar("Task Created Succesfully", { variant: "success" });
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        enqueueSnackbar(
          `error while Create Task ${error.response.data.message} `,
          { variant: "error" }
        );
        if (error.response.statusText == "Unauthorized") {
          handleLogout();
        }
      });
  };

  const handleEdittask = (data) => {
    axios
      .put(
        `${import.meta.env.VITE_API_URL}/api/task/update/${task._id}`,
        { ...data, stage, priority, team },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Pass the token in the headers
          },

          withCredentials: true, // Ensure cookies are sent if needed
        }
      )
      .then((response) => {
        let data = response.data.task;
        let teamField = data.team;
        let newTeamField = teamField.map((id) =>
          teams.find((singleTeam) => id == singleTeam._id)
        );

        data.team = newTeamField;
        dispatch(
          setTasks(tasks.map((task) => (task._id == data._id ? data : task)))
        );
        setLoading(false);
        setOpen(false);
        enqueueSnackbar("Task Created Succesfully", { variant: "success" });
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        enqueueSnackbar(
          `error while Create Task ${error.response.data.message} `,
          { variant: "error" }
        );
        if (error.response.statusText == "Unauthorized") {
          handleLogout();
        }
      });
  };

  const submitHandler = (data) => {
    setLoading(true);
    task ? handleEdittask(data) : handleAddtask(data);
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {task ? "UPDATE TASK" : "ADD TASK"}
          </Dialog.Title>

          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              defaultValue={task && task.title}
              placeholder="Task Title"
              type="text"
              name="title"
              label="Task Title"
              className="w-full rounded"
              register={register("title", { required: "Title is required" })}
              error={errors.title ? errors.title.message : ""}
            />

            <UserList
              setTeam={setTeam}
              team={team}
              selectedTeam={task && task.team}
              teams={teams}
            />

            <div className="flex gap-4">
              <SelectList
                label="Task Stage"
                lists={LISTS}
                selected={stage}
                setSelected={setStage}
              />

              <div className="w-full">
                <Textbox
                  defaultValue={task && task.date.split("T")[0]}
                  placeholder="Date"
                  type="date"
                  name="date"
                  label="Task Date"
                  className="w-full rounded"
                  register={register("date", {
                    required: "Date is required!",
                  })}
                  error={errors.date ? errors.date.message : ""}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <SelectList
                label="Priority Level"
                lists={PRIORIRY}
                selected={priority}
                setSelected={setPriority}
              />
            </div>

            {loading ? (
              <Loading />
            ) : (
              <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
                <Button
                  label="Submit"
                  type="submit"
                  className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
                />

                <Button
                  type="button"
                  className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                  onClick={() => setOpen(false)}
                  label="Cancel"
                />
              </div>
            )}
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddTask;
