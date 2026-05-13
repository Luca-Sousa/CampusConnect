import type { RouteObject } from "react-router-dom";
import Layout from "@/components/layout/layout";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import NewsPage from "@/pages/news";
import GroupsPage from "@/pages/groups";

const routes: RouteObject[] = [
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "news", element: <NewsPage /> },
      { path: "groups", element: <GroupsPage /> },
    ],
  },
];

export default routes;
