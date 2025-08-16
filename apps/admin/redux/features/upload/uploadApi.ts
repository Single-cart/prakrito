import { apiSlice } from "../apiSlice/apiSlice";

export const uploadApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    uploadFiles: build.mutation({
      query: ({ formData, purpose }) => ({
        url: `/upload/multiple?purpose=${purpose}`,
        method: "POST",
        body: formData,
        credentials: "include",
      }),
      invalidatesTags: ["Upload"],
    }),

    deleteUploadedFile: build.mutation({
      query: (uploadId) => ({
        url: `/upload/${uploadId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Upload"],
    }),

    getUploads: build.query({
      query: (purpose) => ({
        url: `/upload?purpose=${purpose}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Upload"],
    }),
  }),
});

export const {
  useUploadFilesMutation,
  useDeleteUploadedFileMutation,
  useGetUploadsQuery,
} = uploadApi;
