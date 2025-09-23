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