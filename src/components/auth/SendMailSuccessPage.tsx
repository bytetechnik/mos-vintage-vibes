import { SendMailSuccessPageProps } from '@/types/forgot-pass';
import { CheckCircle } from 'lucide-react';

const SendMailSuccessPage: React.FC<SendMailSuccessPageProps> = ({
  email,
}) => {
  return (
    <div className="bg-card rounded-xl shadow-lg p-8 border border-border text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-foreground mb-2">Check Your Email</h1>
      <p className="text-muted-foreground mb-6">
        We&apos;ve sent a password reset link to <strong className="text-foreground">{email}</strong>
      </p>
      <p className="text-sm text-muted-foreground mb-6">
        If you don&apos;t see the email, check your spam folder. The link will expire in 5 minutes.
      </p>


    </div>
  );
};

export default SendMailSuccessPage;