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
import VerifyEmailPage from "@/pages/verify-email";
import ForgotPasswordPage from "@/pages/forgot-password";
import ResetPasswordPage from "@/pages/reset-password";
import SigninOtpPage from "@/pages/signin-otp";

const routes: RouteObject[] = [
  { index: true, element: <Navigate to="/feed" replace /> },

  // Rotas públicas — acessíveis por todos, independente de autenticação
  { path: "verify-email", element: <VerifyEmailPage /> },
  { path: "forgot-password", element: <ForgotPasswordPage /> },
  { path: "reset-password", element: <ResetPasswordPage /> },
  { path: "signin-otp", element: <SigninOtpPage /> },

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
