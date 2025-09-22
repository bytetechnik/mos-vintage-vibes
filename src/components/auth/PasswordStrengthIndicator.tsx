import { getPasswordStrength } from '@/schemas/login';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-muted-foreground">Password strength</span>
        <span className={`text-xs ${passwordStrength.color}`}>
          {passwordStrength.label}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1">
        <div
          className={`h-1 rounded-full transition-all duration-300 ${passwordStrength.strength <= 2 ? 'bg-red-500' :
              passwordStrength.strength <= 3 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
          style={{ width: `${passwordStrength.percentage}%` }}
        />
      </div>
    </div>
  );
}