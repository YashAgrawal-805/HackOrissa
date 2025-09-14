import axios from "axios";
import { setIsSolo } from "../store/store";


export const handleFindTravellers = async (lat,lng) => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/find-solo-travellers",
      {
        params: { latitude: lat, longitude: lng },
        withCredentials: true,
      }
    );
    console.log("Nearby solo travellers:", response.data);
    return response.data.nearbyTravellers || [];
    
  } catch (err) {
    console.error("Error:", err);
  }
};

export const handleRecieve = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/my-received-solo-requests",
      { withCredentials: true }
    );
    console.log("Received travel requests:", response.data);
    return response.data.received || [];
  } catch (err) {
    console.error("Error fetching received travel requests:", err);
  }
};

export const handleAccept = async (requestId) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/accept-solo-request",
        { requestId },
        { withCredentials: true }
      );
      console.log("Travel request accepted:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error accepting travel request:", err);
    }
  };

 export const handleSendReq = async (toUserId) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/send-solo-request",
        { toUserId },
        { withCredentials: true }
      );
      console.log("Travel request sent:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error sending travel request:", err);
    }
  };
  export const handleSoloTogelle = async (dispatch) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/toggle-solo",
        {},
        { withCredentials: true }
      );
      console.log("Toggled solo traveller status:", response.data);
      dispatch(setIsSolo(response.data.Issolo || false));
    } catch (err) {
      console.error("Error toggling solo traveller status:", err);
    }
  };