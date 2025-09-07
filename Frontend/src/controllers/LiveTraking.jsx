// LiveTracking.jsx
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLatLng } from "../store/store";

let watchId = null;

const LiveTracking = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    // Start watching on mount
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        dispatch(setLatLng({ lat: latitude, lng: longitude }));
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      { enableHighAccuracy: true }
    );

    // Stop when unmounted
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
        dispatch(setLatLng({ lat: null, lng: null }));
      }
    };
  }, [dispatch]);

  return null; // no UI
};

export default LiveTracking;
