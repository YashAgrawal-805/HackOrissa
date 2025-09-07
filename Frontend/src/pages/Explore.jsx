import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { initSocket, getSocket } from "../controllers/UseSocket";
import SoS from "../controllers/SoS";
import { addConnection, addSendRequest, removeSendRequest } from "../store/store";
import ExpNavbar from "../components/Explore/expNavbar";
import Footer from "../components/Footer";
import HeroAnimation from "../components/Explore/HeroAnimation";
import CardsParallaxAnimation from "../components/Explore/parallex";

const Explore = ({ theme, setTheme }) => {
  const dispatch = useDispatch();

  // Redux state
  const { lat, lng } = useSelector((state) => state.app.latLng);
  const { isTrack, sendRequests } = useSelector((state) => state.app);

  // 🔹 ref to keep latest sendRequests
  const sendRequestsRef = useRef(sendRequests);

  useEffect(() => {
    sendRequestsRef.current = sendRequests;
  }, [sendRequests]);

  // 🔹 Emit location periodically
  useEffect(() => {
    const token = localStorage.getItem("token");
    initSocket(token);
    const socket = getSocket();
    if (!lat || !lng || !socket || !isTrack) return;

    console.log("Sending live location:", lat, lng);
    socket.emit("location", { latitude: lat, longitude: lng });

    const interval = setInterval(() => {
      socket.emit("location", { latitude: lat, longitude: lng });
      console.log("Re-sent location:", lat, lng);
    }, 10000);

    return () => clearInterval(interval);
  }, [lat, lng, isTrack]);

  // 🔹 Handle socket events
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleSoloTraveler = (data) => {
      const existing = sendRequestsRef.current.find(
        (traveler) => traveler.name === data.username
      );

      if (existing) {
        dispatch(removeSendRequest(existing.id));
        console.log(`Removed solo traveler: ${existing.name}`);
      } else {
        dispatch(
          addSendRequest({
            id: data.id,
            username: data.username,
            distance: data.distance,
          })
        );
        console.log(`Added new solo traveler: ${data.username}`);
      }
    };

    const handleSoloRequestReceived = (data) => {
      dispatch(
        addSendRequest({
          id: data.from,
          name: data.username,
          distance: data.distance || null,
        })
      );
      alert("Request Received from " + data.username);
    };

    const handleSosAlert = (data) => {
      const { from, location } = data;
      const locString = location
        ? `(${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)})`
        : "unknown location";

      alert(`SOS Alert from ${from} at location: ${locString}`);
    };

    const handleSoloRequestAccepted = (data) => {
      dispatch(
        addConnection({
          id: data.by,
          name: data.username,
        })
      );
      alert("Request Accepted by " + data.username);
    };

    socket.on("soloTravelerNearby", handleSoloTraveler);
    socket.on("soloRequestReceived", handleSoloRequestReceived);
    socket.on("sosAlert", handleSosAlert);
    socket.on("soloRequestAccepted", handleSoloRequestAccepted);

    return () => {
      socket.off("soloTravelerNearby", handleSoloTraveler);
      socket.off("soloRequestReceived", handleSoloRequestReceived);
      socket.off("sosAlert", handleSosAlert);
      socket.off("soloRequestAccepted", handleSoloRequestAccepted);
    };
  }, [dispatch]);

  // Render
  const gridColor =
    theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";

  return (
    <div
      className="relative min-h-screen"
      style={{
        backgroundColor: theme === "dark" ? "#000000" : "#ffffff",
        backgroundImage: `
          linear-gradient(to right, ${gridColor} 1px, transparent 1px),
          linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }}
    >
      <SoS />
      <ExpNavbar theme={theme} setTheme={setTheme} />
      <HeroAnimation theme={theme} />
      <CardsParallaxAnimation theme={theme} />
      <Footer />
    </div>
  );
};

export default Explore;
