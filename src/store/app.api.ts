import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const fileUploadApi = createApi({
  reducerPath: "fileUploadApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://127.0.0.1:8000" }),
  endpoints: (builder) => ({
    uploadFiles: builder.mutation({
      query: (formData) => ({
        url: "/vcon-upload",
        method: "POST",
        body: formData,
      }),
    }),
    downloadFile: builder.mutation({
      query: (file_name) => ({
        url: `/datasets/${file_name}`,
      }),
    }),
  }),
});

export const { useUploadFilesMutation, useDownloadFileMutation } =
  fileUploadApi;
