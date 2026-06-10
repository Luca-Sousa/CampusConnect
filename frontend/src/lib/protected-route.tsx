import { Navigate, Outlet } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export function ProtectedRoute() {
  const { data: session, isPending } = useSession();

  if (isPending)
    return (
      <div className="flex h-dvh items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );

  if (!session) return <Navigate to="/signin" replace />;

  if (!session.user.emailVerified) {
    return (
      <Navigate
        to={`/verify-email?email=${encodeURIComponent(session.user.email)}`}
        replace
      />
    );
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { data: session, isPending } = useSession();

  if (isPending)
    return (
      <div className="flex h-dvh items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );

  if (session && !session.user.emailVerified) {
    return (
      <Navigate
        to={`/verify-email?email=${encodeURIComponent(session.user.email)}`}
        replace
      />
    );
  }

  if (session) return <Navigate to="/feed" replace />;

  return <Outlet />;
}

export function NotFoundRedirect() {
  const { data: session, isPending } = useSession();

  if (isPending)
    return (
      <div className="flex h-dvh items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );

  return <Navigate to={session ? "/feed" : "/signin"} replace />;
}
