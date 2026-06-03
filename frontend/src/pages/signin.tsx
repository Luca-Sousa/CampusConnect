import { AuthLogo } from "@/components/auth-logo";
import { SigninForm } from "@/features/auth/components/forms/SigninForm";

const SigninPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6">
        <AuthLogo />
        <SigninForm />
      </div>
    </div>
  );
};

export default SigninPage;
