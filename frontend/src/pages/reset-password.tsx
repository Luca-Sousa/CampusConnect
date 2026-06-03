import { Navigate, useSearchParams } from "react-router-dom";
import { AuthLogo } from "@/components/auth-logo";
import { ResetPasswordForm } from "@/features/auth/components/forms/ResetPasswordForm";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";

  if (!email) return <Navigate to="/forgot-password" replace />;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6">
        <AuthLogo />
        <ResetPasswordForm email={email} />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
