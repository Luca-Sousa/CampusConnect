import { AuthLogo } from "@/components/auth-logo";
import { SigninOtpForm } from "@/features/auth/components/forms/SigninOtpForm";

const SigninOtpPage = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6 w-full max-w-sm lg:max-w-md">
      <AuthLogo />
      <SigninOtpForm />
    </div>
  </div>
);

export default SigninOtpPage;
