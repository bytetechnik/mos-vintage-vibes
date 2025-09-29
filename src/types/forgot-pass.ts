export interface ResetFormData {
  email: string;
}

export interface ResetPassFormProps {
  onSubmit: (data: ResetFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export interface SendMailSuccessPageProps {
  email: string;

}


// Data collected from the form only
// Data coming only from the form
export interface ResetPassFormData {
  password: string;
  confirmPassword: string;
}

// Final payload sent to API
export interface resetPassPageProps extends ResetPassFormData {
  email: string;
  token: string;
}

// Props for PasswordRest component
export interface ResetPassPageFormProps {
  onSubmit: (data: ResetPassFormData) => Promise<void>;
  isSubmitting?: boolean;
}
