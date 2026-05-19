import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "@/lib/auth-client";

export function ProtectedRoute() {
  const { data: session, isPending } = useSession();

  if (isPending) return null;

  if (!session) return <Navigate to="/signin" replace />;

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { data: session, isPending } = useSession();

  if (isPending) return null;

  if (session) return <Navigate to="/feed" replace />;

  return <Outlet />;
}

export function NotFoundRedirect() {
  const { data: session, isPending } = useSession();

  if (isPending) return null;

  return <Navigate to={session ? "/feed" : "/signin"} replace />;
}
