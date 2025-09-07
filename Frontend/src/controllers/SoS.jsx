import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setIsSOS } from "../store/store";

const SoS = () => {
  const { lat, lng } = useSelector((state) => state.app.latLng);
  const isSOS = useSelector((state) => state.app.isSOS);
  const dispatch = useDispatch();

  const [countdown, setCountdown] = useState(null);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const startSOS = () => {
    setCountdown(10);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {}); // ignore autoplay block
    }
  };
  

  const cancelSOS = () => {
    clearInterval(timerRef.current);
    setCountdown(null);
  
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  
    dispatch(setIsSOS(false));
  };
  
  useEffect(() => {
    if (isSOS) {
      startSOS();
    } else {
      cancelSOS();
    }
  }, [isSOS]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      axios.post(
        "http://localhost:3000/api/trigger-sos",
        { latitude: lat, longitude: lng },
        { withCredentials: true }
      )
      .then(res => console.log("SOS sent:", res.data))
      .catch(err => console.error("Error triggering SOS:", err));

      cancelSOS();
      return;
    }

    timerRef.current = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timerRef.current);
  }, [countdown]);

  if (!isSOS) return null; // don't render if not active

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <audio ref={audioRef} src="/buzzer.mp3" loop />
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl text-center max-w-sm w-full">
        <h2 className="text-xl font-bold text-red-600">🚨 SOS ALERT 🚨</h2>
        <p className="mt-4 text-lg">
          SOS will be sent in <span className="font-bold">{countdown}</span>s
        </p>
        <button
          onClick={cancelSOS}
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >   
          Cancel SOS
        </button>
      </div>
    </div>
  );
};

export default SoS;
