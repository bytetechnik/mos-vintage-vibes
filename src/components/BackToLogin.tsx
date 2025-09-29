import { ArrowLeft } from "lucide-react";
import Link from "next/link";


const BackToLoginButton = () => {
  return (
    <div className="text-center mb-8">
      <Link
        href="/login"
        className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Login</span>
      </Link>
    </div>
  );
};

export default BackToLoginButton;
