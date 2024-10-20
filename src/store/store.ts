import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { fileUploadApi } from "./app.api";

export const store = configureStore({
  reducer: {
    [fileUploadApi.reducerPath]: fileUploadApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(fileUploadApi.middleware),
});

setupListeners(store.dispatch);
