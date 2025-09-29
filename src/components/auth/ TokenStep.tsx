"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface TokenStepProps {
  onNext: (token: string) => void;
  isSubmitting?: boolean;
}

// define yup schema
const tokenSchema = yup.object({
  token: yup.string().required("Reset token is required"),
});

type TokenFormData = yup.InferType<typeof tokenSchema>;

const TokenStep: React.FC<TokenStepProps> = ({ onNext, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TokenFormData>({
    resolver: yupResolver(tokenSchema),
    mode: "onChange",
  });

  const onSubmit = (data: TokenFormData) => {
    onNext(data.token);
  };

  return (
    <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
      <h2 className="text-xl font-bold mb-4">Enter Reset Token</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* Token Field */}
        <div>
          <Label htmlFor="token">Reset Token</Label>
          <Input
            id="token"
            placeholder="Paste your reset token"
            {...register("token")}
            className={`mt-2 ${errors.token ? "border-red-500 focus:border-red-500" : ""}`}
            disabled={isSubmitting}
          />
          {errors.token && (
            <p className="text-sm text-red-500 mt-1">
              {errors.token.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            "Next"
          )}
        </Button>
      </form>
    </div>
  );
};

export default TokenStep;
