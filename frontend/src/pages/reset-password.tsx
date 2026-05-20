import { Navigate, useSearchParams } from "react-router-dom";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";

  if (!email) return <Navigate to="/forgot-password" replace />;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <ResetPasswordForm email={email} />
    </div>
  );
};

export default ResetPasswordPage;
