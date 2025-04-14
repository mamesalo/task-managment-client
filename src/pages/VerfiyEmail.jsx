import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const VerfiyEmail = () => {
  const [message, setmessage] = useState(
    "Please wait while verifing your email address."
  );
  const param = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/api/user/verify/${
          param.token
        }`;
        const res = await axios.post(url);
        setmessage(res.data.message);
        setTimeout(() => {
          navigate("/log-in");
        }, 2000);
      } catch (error) {
        console.log(error);
        setmessage("❌ Verification failed. Link may have expired.");
      }
    };
    verifyEmailUrl();
  }, [param]);
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md text-center">
        <h2 className="text-xl font-semibold">{message}</h2>
      </div>
    </div>
  );
};

export default VerfiyEmail;
