import { Navigate, useSearchParams } from "react-router-dom";
import { useSession } from "@/lib/auth-client";
import { VerifyEmailForm } from "@/features/auth/components/forms/VerifyEmailForm";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const { data: session, isPending } = useSession();

  const email = searchParams.get("email") ?? session?.user.email ?? "";

  if (isPending) return null;

  if (session?.user.emailVerified) return <Navigate to="/feed" replace />;

  if (!email) return <Navigate to="/signin" replace />;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <VerifyEmailForm email={email} />
    </div>
  );
};

export default VerifyEmailPage;
