import { configureStore, createSlice } from "@reduxjs/toolkit";
import { distance } from "framer-motion";

const initialState = {
  latLng: { lat: null, lng: null }, // default empty
  isLoggedIn: false,
  isSOS: false,
  isAlert: false,
  isNotify: false,
  isTrack: false,
  isSolo: false,   // ✅ new field
  sendRequests: [],
  acceptedRequests: [],
  connections: [],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLatLng: (state, action) => {
      state.latLng = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setIsSOS: (state, action) => {
      state.isSOS = action.payload;
    },
    setIsAlert: (state, action) => {
      state.isAlert = action.payload;
    },
    setIsNotify: (state, action) => {
      state.isNotify = action.payload;
    },
    setIsTrack: (state, action) => {
      state.isTrack = action.payload;
    },
    setIsSolo: (state, action) => {   // ✅ reducer for isSolo
      state.isSolo = action.payload;
    },

    // ✅ send requests
    setSendRequests: (state, action) => {
      state.sendRequests = action.payload;
    },
    addSendRequest: (state, action) => {
      const data = action.payload;
      state.sendRequests.push({
        id: data.id,
        name: data.username,
        distance: data.distance,
      });
    },
    removeSendRequest: (state, action) => {
      state.sendRequests = state.sendRequests.filter(
        (req) => req.id !== action.payload
      );
    },

    // ✅ accepted requests
    setAcceptedRequests: (state, action) => {
      state.acceptedRequests = action.payload;
    },
    addAcceptedRequest: (state, action) => {
      const data = action.payload;
      state.acceptedRequests.push({
        id: data.id,
        name: data.name,
        distance:data.distance
      });
    },
    removeAcceptedRequest: (state, action) => {
      state.acceptedRequests = state.acceptedRequests.filter(
        (req) => req.id !== action.payload
      );
    },

    // ✅ connections
    setConnections: (state, action) => {
      state.connections = action.payload;
    },
    addConnection: (state, action) => {
      const data = action.payload;
      state.connections.push({
        id: data.by,
        phone: data.contact,
      });
    },
    removeConnection: (state, action) => {
      state.connections = state.connections.filter(
        (conn) => conn.id !== action.payload
      );
    },

    reset: () => initialState,
  },
});

export const {
  setLatLng,
  setIsLoggedIn,
  setIsSOS,
  setIsAlert,
  setIsNotify,
  setIsTrack,
  setIsSolo,          // ✅ exported
  setSendRequests,
  addSendRequest,
  removeSendRequest,
  setAcceptedRequests,
  addAcceptedRequest,
  removeAcceptedRequest,
  setConnections,
  addConnection,
  removeConnection,
  reset,
} = appSlice.actions;

const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

export default store;
