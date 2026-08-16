import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import articlesReducer from "./features/articles/articlesSlice";
import submissionsReducer from "./features/submissions/submissionsSlice";
import issuesReducer from "./features/issues/issuesSlice";
import reviewerReducer from "./features/reviewer/reviewerSlice";
import adminReducer from "./features/admin/adminSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  articles: articlesReducer,
  submissions: submissionsReducer,
  issues: issuesReducer,
  reviewer: reviewerReducer,
  admin: adminReducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];
