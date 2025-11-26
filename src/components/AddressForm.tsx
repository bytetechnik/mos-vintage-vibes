import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AddressFormData, addressFormSchema, defaultAddressValues } from '@/schemas/address';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';

interface Country {
  name: string;
  code: string;
  phoneCode: string;
}

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void;
  onCancel: () => void;
  initialData?: Partial<AddressFormData>;
  isLoading?: boolean;
  isEditing?: boolean;
  countries: Country[];
}

export const AddressForm = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  isEditing = false,
  countries,
}: AddressFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: yupResolver(addressFormSchema) as unknown as Resolver<AddressFormData>,
    defaultValues: defaultAddressValues,
  });

  const selectedCountryCode = watch('countryCode');

  useEffect(() => {
    if (initialData) {
      const processedData = {
        ...defaultAddressValues,
        ...initialData,
        countryCode: initialData.countryCode || 'DE',
      };
      reset(processedData);
    }
  }, [initialData, reset]);

  const getPhoneCodeForCountry = (countryCode: string): string => {
    const country = countries.find((c) => c.code === countryCode);
    return country?.phoneCode || '+49';
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <Label htmlFor="firstName">
              First Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="firstName"
              {...register('firstName')}
              className={errors.firstName ? 'border-destructive' : ''}
              placeholder="John"
            />
            {errors.firstName && (
              <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <Label htmlFor="lastName">
              Last Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="lastName"
              {...register('lastName')}
              className={errors.lastName ? 'border-destructive' : ''}
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>
            )}
          </div>

          {/* Company */}
          <div>
            <Label htmlFor="company">Company (Optional)</Label>
            <Input id="company" {...register('company')} placeholder="Acme Inc." />
            {errors.company && (
              <p className="text-xs text-destructive mt-1">{errors.company.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className={errors.email ? 'border-destructive' : ''}
              placeholder="john.doe@example.com"
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Country Dropdown */}
          <div>
            <Label htmlFor="countryCode">
              Country <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="countryCode"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="countryCode"
                    className={`w-full ${errors.countryCode ? 'border-destructive' : ''}`}
                  >
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.countryCode && (
              <p className="text-xs text-destructive mt-1">{errors.countryCode.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <Label htmlFor="phoneNo">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <div className="w-24 flex items-center px-3 border rounded-md bg-muted text-sm font-medium">
                {getPhoneCodeForCountry(selectedCountryCode)}
              </div>
              <Input
                id="phoneNo"
                type="tel"
                {...register('phoneNo')}
                className={errors.phoneNo ? 'border-destructive flex-1' : 'flex-1'}
                placeholder="1234567890"
              />
            </div>
            {errors.phoneNo && (
              <p className="text-xs text-destructive mt-1">{errors.phoneNo.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Address Information
        </h3>
        <div className="space-y-4">
          {/* Address Line 1 */}
          <div>
            <Label htmlFor="addressLine1">
              Street Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="addressLine1"
              {...register('addressLine1')}
              className={errors.addressLine1 ? 'border-destructive' : ''}
              placeholder="123 Main Street"
            />
            {errors.addressLine1 && (
              <p className="text-xs text-destructive mt-1">{errors.addressLine1.message}</p>
            )}
          </div>

          {/* Address Line 2 */}
          <div>
            <Label htmlFor="addressLine2">Apartment, suite, etc. (Optional)</Label>
            <Input
              id="addressLine2"
              {...register('addressLine2')}
              placeholder="Apartment 4B, Building 2"
            />
            {errors.addressLine2 && (
              <p className="text-xs text-destructive mt-1">{errors.addressLine2.message}</p>
            )}
          </div>

          {/* City, State, Postal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">
                City <span className="text-destructive">*</span>
              </Label>
              <Input
                id="city"
                {...register('city')}
                className={errors.city ? 'border-destructive' : ''}
                placeholder="Berlin"
              />
              {errors.city && (
                <p className="text-xs text-destructive mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="stateProvince">State / Province</Label>
              <Input
                id="stateProvince"
                {...register('stateProvince')}
                placeholder="Bavaria"
              />
              {errors.stateProvince && (
                <p className="text-xs text-destructive mt-1">{errors.stateProvince.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="postalCode">
                Postal Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="postalCode"
                {...register('postalCode')}
                className={errors.postalCode ? 'border-destructive' : ''}
                placeholder="10115"
              />
              {errors.postalCode && (
                <p className="text-xs text-destructive mt-1">{errors.postalCode.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Default Address Checkbox */}
      <div className="flex items-center space-x-2 pt-2">
        <Controller
          name="isDefault"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="isDefault"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="isDefault" className="cursor-pointer font-normal">
          Set as default address
        </Label>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          variant="street"
          size="lg"
          onClick={handleFormSubmit}
          disabled={isLoading}
          className="min-w-[140px]"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              {isEditing ? 'Updating...' : 'Saving...'}
            </>
          ) : isEditing ? (
            'Update Address'
          ) : (
            'Save Address'
          )}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};