import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import axios from "axios";
import { handleLogout } from "../utils";
import { HiBellAlert } from "react-icons/hi2";
import { BiSolidMessageRounded } from "react-icons/bi";
import moment from "moment";
import Loading from "../components/Loader";
import { io } from "socket.io-client";

const Notification = () => {
  const [loading, setloading] = useState(false);
  const [data, setdata] = useState([]);
  const ICONS = {
    alert: <HiBellAlert className="h-5 w-5 text-gray-600 " />,
    message: <BiSolidMessageRounded className="h-5 w-5 text-gray-600 " />,
  };
  const token = document.cookie.split("; ");
  const fetchNotifications = () => {
    setloading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/user/all_notifications`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the headers
        },
        withCredentials: true, // Ensure cookies are sent if needed
      })
      .then((response) => {
        setdata(response.data);
        setloading(false);
      })
      .catch((error) => {
        console.error(error);
        setloading(false);
        if (
          error.response.statusText == "Unauthorized" ||
          error.response.data.statusText == "Unauthorized"
        ) {
          handleLogout();
        }
        console.log(error.response.statusText);
      });
  };
  useEffect(() => {
    fetchNotifications();
  }, []);
  return (
    <div className="flex flex-col gap-6">
      <div className="absolute top-1/2 left-1/2">{loading && <Loading />}</div>
      <Title title="Notification" className="mb-7" />
      {data.map((item, index) => (
        <div
          key={item._id + index}
          className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5"
        >
          <div className="p-4">
            <div className="group relative flex gap-x-4 rounded-lg p-4 ">
              <div className="mt-1 h-8 w-8 flex items-center justify-center rounded-lg bg-gray-200 ">
                {ICONS[item.notiType]}
              </div>

              <div className="">
                <div className="flex items-center gap-3 font-semibold text-gray-900 capitalize">
                  <p> {item.notiType}</p>
                  <span className="text-xs font-normal lowercase">
                    {moment(item.createdAt).fromNow()}
                  </span>
                </div>
                <p className="line-clamp-1 mt-1 text-gray-600">{item.text}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x bg-gray-50"></div>
        </div>
      ))}
    </div>
  );
};

export default Notification;
