import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
  latLng: { lat: null, lng: null }, // default empty
  isLoggedIn: false,
  isSOS: false,
  isAlert: false,
  isNotify: false,
  isTrack: false,
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
    reset: () => initialState, // reset all values
  },
});

export const {
  setLatLng,
  setIsLoggedIn,
  setIsSOS,
  setIsAlert,
  setIsNotify,
  setIsTrack,
  reset,
} = appSlice.actions;

const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

export default store;
