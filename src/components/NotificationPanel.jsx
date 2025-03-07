import { Popover, Transition } from "@headlessui/react";
import axios from "axios";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import { handleLogout } from "../utils";
import Loading from "./Loader";
const ICONS = {
  alert: (
    <HiBellAlert className="h-5 w-5 text-gray-600 group-hover:text-indigo-600" />
  ),
  message: (
    <BiSolidMessageRounded className="h-5 w-5 text-gray-600 group-hover:text-indigo-600" />
  ),
};

const NotificationPanel = () => {
  const [data, setdata] = useState([]);

  const [reload, setreload] = useState(true);
  const [loading, setloading] = useState(false);
  const token = document.cookie.split("; ");

  const fetchNotifications = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/user/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the headers
        },
        withCredentials: true, // Ensure cookies are sent if needed
      })
      .then((response) => {
        setdata(response.data);
        setreload(false);
        setloading(false);
      })
      .catch((error) => {
        console.error(error);
        setreload(false);
        setloading(false);
        if (error.response.statusText == "Unauthorized") {
          handleLogout();
        }
        console.log(error.response.statusText);
      });
  };
  const readHandler = (type, id) => {
    setloading(true);
    axios
      .put(
        `${
          import.meta.env.VITE_API_URL
        }/api/user/read-noti?id=${id}&isReadType=${type}`,
        {
          ...data,
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
        console.log("read succesfully");
        setreload(true);
      })
      .catch((error) => {
        setloading(false);
        loading(false);
        console.error(error);
        enqueueSnackbar(
          `error while updating ${error.response.data.message} `,
          { variant: "error" }
        );
        if (error.response.statusText == "Unauthorized") {
          handleLogout();
        }
      });
  };
  const viewHandler = () => {};

  const callsToAction = [
    { name: "Cancel", href: "#", icon: "" },
    {
      name: "Mark All Read",
      href: "#",
      icon: "",
      onClick: () => readHandler("all", ""),
    },
  ];

  useEffect(() => {
    if (!reload) {
      return;
    }

    fetchNotifications();
  }, [reload]);

  return (
    <>
      <Popover className="relative">
        <Popover.Button className="inline-flex items-center outline-none">
          <div className="w-8 h-8 flex items-center justify-center text-gray-800 relative">
            <IoIosNotificationsOutline className="text-2xl" />
            {data?.length > 0 && (
              <span className="absolute text-center top-0 right-1 text-sm text-white font-semibold w-4 h-4 rounded-full bg-red-600">
                {data?.length}
              </span>
            )}
          </div>
        </Popover.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="absolute -right-16 md:-right-2 z-10 mt-5 flex w-screen max-w-max  px-4">
            {({ close }) =>
              data?.length > 0 && (
                <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                  <div className="p-4">
                    {loading && <Loading />}
                    {data?.slice(0, 5).map((item, index) => (
                      <button
                        key={item._id + index}
                        onClick={(e) => readHandler("", item._id)}
                        className="group relative flex gap-x-4 rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="mt-1 h-8 w-8 flex items-center justify-center rounded-lg bg-gray-200 group-hover:bg-white">
                          {ICONS[item.notiType]}
                        </div>

                        <div
                          className="cursor-pointer"
                          onClick={() => viewHandler(item)}
                        >
                          <div className="flex items-center gap-3 font-semibold text-gray-900 capitalize">
                            <p> {item.notiType}</p>
                            <span className="text-xs font-normal lowercase">
                              {moment(item.createdAt).fromNow()}
                            </span>
                          </div>
                          <p className="line-clamp-1 mt-1 text-gray-600">
                            {item.text}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 divide-x bg-gray-50">
                    {callsToAction.map((item) => (
                      <Link
                        key={item.name}
                        onClick={
                          item?.onClick ? () => item.onClick() : () => close()
                        }
                        className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-blue-600 hover:bg-gray-100"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }
          </Popover.Panel>
        </Transition>
      </Popover>
    </>
  );
};

export default NotificationPanel;
