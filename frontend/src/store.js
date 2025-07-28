// store.js
import { configureStore } from "@reduxjs/toolkit";
import matchReducer from "./slices/matchSlice";

export default configureStore({
  reducer: {
    match: matchReducer,
  },
});
