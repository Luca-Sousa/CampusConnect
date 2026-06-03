import { AuthLogo } from "@/components/auth-logo";
import { SignupForm } from "@/features/auth/components/forms/SignupForm";

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6 w-full max-w-sm lg:max-w-md">
        <AuthLogo />
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;