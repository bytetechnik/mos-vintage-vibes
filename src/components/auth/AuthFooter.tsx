import Link from 'next/link';

export function AuthFooter() {
  return (
    <div className="text-center mt-6">
      <p className="text-sm text-muted-foreground">
        By signing up, you agree to our{' '}
        <Link href="/terms" className="text-vintage-orange hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-vintage-orange hover:underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}