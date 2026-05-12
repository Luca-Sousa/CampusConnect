import type { RouteObject } from "react-router-dom";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import NewsPage from "@/pages/news";
import GroupsPage from "@/pages/groups";

const routes: RouteObject[] = [
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/news", element: <NewsPage /> },
  { path: "/groups", element: <GroupsPage /> },
];

export default routes;
