import type { RouteObject } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import NewsPage from "@/pages/news";
import GroupsPage from "@/pages/groups";

const routes: RouteObject[] = [
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "news", element: <NewsPage /> },
      { path: "groups", element: <GroupsPage /> },
    ],
  },
];

export default routes;

