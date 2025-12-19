import * as yup from 'yup';

export const addressFormSchema = yup.object().shape({
  type: yup.string()
    .oneOf(['SHIPPING', 'BILLING', 'BOTH'], 'Invalid address type')
    .required('Address type is required'),
  firstName: yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .required('First name is required'),
  lastName: yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .required('Last name is required'),
  company: yup.string()
    .max(100, 'Company name must not exceed 100 characters')
    .optional(),
  phoneNo: yup.string()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Invalid phone number')
    .required('Phone number is required'),
  email: yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  addressLine1: yup.string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must not exceed 200 characters')
    .required('Street address is required'),
  addressLine2: yup.string()
    .max(200, 'Address must not exceed 200 characters')
    .optional(),
  city: yup.string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must not exceed 100 characters')
    .required('City is required'),
  stateProvince: yup.string()
    .max(100, 'State/Province must not exceed 100 characters')
    .optional(),
  postalCode: yup.string()
    .matches(/^[0-9]{4,10}$/, 'Invalid postal code')
    .required('Postal code is required'),
  countryCode: yup.string()
    .min(2, 'Country code must be at least 2 characters')
    .max(3, 'Country code must be at most 3 characters')
    .required('Country code is required'),
  formattedAddress: yup.string().optional(),
  default: yup.boolean().default(false),
  latitude: yup.number().optional(),
  longitude: yup.number().optional(),
});

export type AddressFormData = yup.InferType<typeof addressFormSchema>;

export const defaultAddressValues: AddressFormData = {
  type: 'BOTH',
  firstName: '',
  lastName: '',
  company: '',
  phoneNo: '',
  email: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  stateProvince: '',
  postalCode: '',
  countryCode: 'DE',
  formattedAddress: '',
  default: false,
  latitude: undefined,
  longitude: undefined,
};