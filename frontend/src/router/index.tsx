import { Navigate, type RouteObject } from "react-router-dom";
import Layout from "@/components/layout/layout";
import {
  ProtectedRoute,
  PublicOnlyRoute,
  NotFoundRedirect,
} from "@/lib/protected-route";
import SigninPage from "@/pages/signin";
import NewsPage from "@/pages/news";
import GroupsPage from "@/pages/groups";
import FeedPage from "@/pages/feed";
import EventsPage from "@/pages/events";
import SignupPage from "@/pages/signup";

const routes: RouteObject[] = [
  { index: true, element: <Navigate to="/feed" replace /> },

  {
    path: "/",
    element: <PublicOnlyRoute />,
    children: [
      { path: "signin", element: <SigninPage /> },
      { path: "signup", element: <SignupPage /> },
    ],
  },

  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: "feed", element: <FeedPage /> },
          { path: "events", element: <EventsPage /> },
          { path: "news", element: <NewsPage /> },
          { path: "groups", element: <GroupsPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundRedirect /> },
];

export default routes;
