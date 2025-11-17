import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AddressFormData, addressFormSchema, defaultAddressValues } from '@/schemas/address';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void;
  onCancel: () => void;
  initialData?: Partial<AddressFormData>;
  isLoading?: boolean;
  isEditing?: boolean;
}

export const AddressForm = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  isEditing = false,
}: AddressFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: yupResolver(addressFormSchema) as unknown as Resolver<AddressFormData>,
    defaultValues: defaultAddressValues,
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Address Type - Radio Buttons */}
      {/* <div>
        <Label>
          Address Type <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="SHIPPING"
                  checked={field.value === 'SHIPPING'}
                  onChange={() => field.onChange('SHIPPING')}
                  className="w-4 h-4"
                />
                <Home className="w-4 h-4" />
                <span>Shipping</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="BILLING"
                  checked={field.value === 'BILLING'}
                  onChange={() => field.onChange('BILLING')}
                  className="w-4 h-4"
                />
                <Building className="w-4 h-4" />
                <span>Billing</span>
              </label>
            </div>
          )}
        />
        {errors.type && (
          <p className="text-xs text-destructive mt-1">{errors.type.message}</p>
        )}
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <Label htmlFor="firstName">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            {...register('firstName')}
            className={errors.firstName ? 'border-destructive' : ''}
          />
          {errors.firstName && (
            <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <Label htmlFor="lastName">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            {...register('lastName')}
            className={errors.lastName ? 'border-destructive' : ''}
          />
          {errors.lastName && (
            <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>
          )}
        </div>

        {/* Company */}
        <div>
          <Label htmlFor="company">Company (Optional)</Label>
          <Input id="company" {...register('company')} />
          {errors.company && (
            <p className="text-xs text-destructive mt-1">{errors.company.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <Label htmlFor="phoneNo">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phoneNo"
            type="tel"
            {...register('phoneNo')}
            className={errors.phoneNo ? 'border-destructive' : ''}
            placeholder="+880 1234567890"
          />
          {errors.phoneNo && (
            <p className="text-xs text-destructive mt-1">{errors.phoneNo.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className={errors.email ? 'border-destructive' : ''}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Country - Plain Text Input */}
        <div>
          <Label htmlFor="countryCode">
            Country <span className="text-red-500">*</span>
          </Label>
          <Input
            id="countryCode"
            {...register('countryCode')}
            className={errors.countryCode ? 'border-destructive' : ''}
            placeholder="DE"
          />
          {errors.countryCode && (
            <p className="text-xs text-destructive mt-1">{errors.countryCode.message}</p>
          )}
        </div>
      </div>

      {/* Address Line 1 */}
      <div>
        <Label htmlFor="addressLine1">
          Street Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="addressLine1"
          {...register('addressLine1')}
          className={errors.addressLine1 ? 'border-destructive' : ''}
          placeholder="House number and street name"
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
          placeholder="Apartment, suite, unit, building, floor, etc."
        />
        {errors.addressLine2 && (
          <p className="text-xs text-destructive mt-1">{errors.addressLine2.message}</p>
        )}
      </div>

      {/* City, State, Postal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">
            City <span className="text-red-500">*</span>
          </Label>
          <Input
            id="city"
            {...register('city')}
            className={errors.city ? 'border-destructive' : ''}
          />
          {errors.city && (
            <p className="text-xs text-destructive mt-1">{errors.city.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="stateProvince">State / Province</Label>
          <Input id="stateProvince" {...register('stateProvince')} />
          {errors.stateProvince && (
            <p className="text-xs text-destructive mt-1">{errors.stateProvince.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="postalCode">
            Postal Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="postalCode"
            {...register('postalCode')}
            className={errors.postalCode ? 'border-destructive' : ''}
          />
          {errors.postalCode && (
            <p className="text-xs text-destructive mt-1">{errors.postalCode.message}</p>
          )}
        </div>
      </div>

      {/* Is Default Checkbox */}
      <div className="flex items-center space-x-2">
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
        <Label htmlFor="isDefault" className="cursor-pointer">
          Set as default address
        </Label>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <Button variant="street" size="lg" type="submit" disabled={isLoading}>
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
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>

      </div>
    </form>
  );
};