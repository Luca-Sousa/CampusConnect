import type { RouteObject } from "react-router-dom";
import Layout from "@/components/layout/layout";
import LoginPage from "@/pages/login";
import NewsPage from "@/pages/news";
import GroupsPage from "@/pages/groups";
import FeedPage from "@/pages/feed";
import EventsPage from "@/pages/events";
import SignupPage from "@/pages/signup";

const routes: RouteObject[] = [
  { path: "/login", element: <LoginPage /> },

  { path: "/signup", element: <SignupPage /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <FeedPage /> },
      { path: "events", element: <EventsPage /> },
      { path: "news", element: <NewsPage /> },
      { path: "groups", element: <GroupsPage /> },
    ],
  },
];

export default routes;
