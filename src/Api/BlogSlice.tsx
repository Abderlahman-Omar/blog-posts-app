import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const blogApi = createApi({
    reducerPath: "blogApi",
    tagTypes: ["user"],
    baseQuery: fetchBaseQuery({
        baseUrl: "https://newsapi.org/v2/",
        prepareHeaders: (headers,) => {
            headers.set("Accept", "application/json");
            headers.set("Accept-Language", "en");
            headers.set("Authorization", `Bearer token`);
            return headers;
        },
    }),

    endpoints: (builder) => ({
        getSettings: builder.query<any, void>({
            query: () => ({
                url: "/top-headlines?country=us&apiKey=28d521ac2ce84805be220dec4ab58f6b",
                method: "GET",
            }),
        }),
    }),
});
export const {
    useGetSettingsQuery,
} = blogApi;
