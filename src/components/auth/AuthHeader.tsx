import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function AuthHeader() {
  return (
    <div className="text-center mb-8">
      <Link
        href="/"
        className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
      <p className="text-muted-foreground">Sign in to your account or create a new one</p>
    </div>
  );
}