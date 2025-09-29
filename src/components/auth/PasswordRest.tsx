import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { passwordRestSchema } from "@/schemas/login";
import {
  ResetPassFormData,
  ResetPassPageFormProps,
} from "@/types/forgot-pass";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

const PasswordRest: React.FC<ResetPassPageFormProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPassFormData>({
    resolver: yupResolver(passwordRestSchema),
    mode: "onChange",
  });

  return (
    <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* New Password */}
        <div>
          <Label htmlFor="password">New Password</Label>
          <div className="relative mt-2">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Enter new password"
              className={`pl-10 ${errors.password ? "border-red-500 focus:border-red-500" : ""}`}
              disabled={isSubmitting}
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative mt-2">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm new password"
              className={`pl-10 ${errors.confirmPassword ? "border-red-500 focus:border-red-500" : ""}`}
              disabled={isSubmitting}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
        // disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Resetting Password...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>

        {/* Back to login */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Remember your password?{" "}
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

export default PasswordRest;
