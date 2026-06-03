import { AuthLogo } from "@/components/auth-logo";
import { ForgotPasswordForm } from "@/features/auth/components/forms/ForgotPasswordForm";

const ForgotPasswordPage = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <div className="flex flex-col items-center gap-6">
      <AuthLogo />
      <ForgotPasswordForm />
    </div>
  </div>
);

export default ForgotPasswordPage;
