import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { initSocket, getSocket } from "../controllers/UseSocket";
import SoS from "../controllers/SoS";
import {addAcceptedRequest, addConnection, addSendRequest, removeSendRequest } from "../store/store";
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
        console.log("New solo traveler nearby:", data);
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
      console.log("Solo request received:", data);
      dispatch(
        addAcceptedRequest({
          id: data.from,
          name: data.name,
          distance: data.distance || null,
        })
      );
      dispatch(removeSendRequest(data.from));
      alert("Request Received from " + data.from, data.name);
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
      alert("Request Accepted by " + data.by);
    };
    const handleNearbyNotification = (data) => {
      alert(data.message);
    }

    const handleDistanceNotifications = (notifications) => {
      if (Array.isArray(notifications) && notifications.length > 0) {
        notifications.forEach((notification) => {
          const { groupId, message } = notification;
    
          if (groupId && message) {
            console.log(`Received notification for group ${groupId}: ${message}`);
            alert(message); // You can replace alert with a custom UI component
          } else {
            console.error("Invalid notification format:", notification);
          }
        });
      } else {
        console.log("No notifications or invalid format received.");
      }
    }
    
    socket.on("soloTravelerNearby", handleSoloTraveler);
    socket.on("soloRequestReceived", handleSoloRequestReceived);
    socket.on("sosAlert", handleSosAlert);
    socket.on("soloRequestAccepted", handleSoloRequestAccepted);
    socket.on("nearbyNotification", handleNearbyNotification);
    socket.on("distanceNotifications", handleDistanceNotifications);

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
