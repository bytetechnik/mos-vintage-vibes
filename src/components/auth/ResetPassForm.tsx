import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resetPasswordSchema } from '@/schemas/login';
import { ResetFormData, ResetPassFormProps } from "@/types/forgot-pass";
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

const ResetPassForm: React.FC<ResetPassFormProps> = ({
  onSubmit,
  isSubmitting = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onChange',
  });


  return (
    <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <div className="relative mt-2">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="your@email.com"
              className={`pl-10 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
              disabled={isSubmitting}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
        // disabled={isSubmitting || !isValid || !watchedEmail}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending Reset Link...
            </>
          ) : (
            'Send Reset Link'
          )}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link
              href="/login"
              className="text-orange-500 hover:underline focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 rounded"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ResetPassForm;