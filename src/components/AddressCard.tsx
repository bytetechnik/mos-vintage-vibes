import { Button } from '@/components/ui/button';
import { Check, Edit, Trash2 } from 'lucide-react';

interface AddressCardProps {
  address: any;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

// Country mapping for display
const COUNTRY_NAMES: Record<string, string> = {
  'BE': 'Belgium',
  'EL': 'Greece',
  'LT': 'Lithuania',
  'PT': 'Portugal',
  'BG': 'Bulgaria',
  'ES': 'Spain',
  'LU': 'Luxembourg',
  'RO': 'Romania',
  'CZ': 'Czechia',
  'FR': 'France',
  'HU': 'Hungary',
  'SI': 'Slovenia',
  'DK': 'Denmark',
  'HR': 'Croatia',
  'MT': 'Malta',
  'SK': 'Slovakia',
  'DE': 'Germany',
  'IT': 'Italy',
  'NL': 'Netherlands',
  'FI': 'Finland',
  'EE': 'Estonia',
  'CY': 'Cyprus',
  'AT': 'Austria',
  'SE': 'Sweden',
  'IE': 'Ireland',
  'LV': 'Latvia',
  'PL': 'Poland',
};

export const AddressCard = ({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  isDeleting = false,
}: AddressCardProps) => {
  const fullName = address.firstName && address.lastName
    ? `${address.firstName} ${address.lastName}`
    : address.fullName || 'No Name';

  // Get country name from code
  const countryCode = address.country || address.countryCode;
  const countryName = COUNTRY_NAMES[countryCode] || countryCode;
  return (
    <div
      className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${isSelected
        ? 'border-primary bg-primary/5 shadow-md'
        : 'border-border hover:border-primary/50 hover:shadow-md'
        }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-4">
        {/* Selection Circle */}
        <div
          className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected
            ? 'border-vintage-orange bg-vintage-orange'
            : 'border-muted-foreground'
            }`}
        >
          {isSelected && <Check className="w-4 h-4 text-white" />}
        </div>

        {/* Address Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="font-bold text-lg">{fullName}</span>
            {address.default && (
              <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-semibold">
                Default
              </span>
            )}
          </div>

          <p className="text-sm font-medium text-muted-foreground mb-2">
            📱 {address.phoneNo}
          </p>

          {address.email && (
            <p className="text-sm font-medium text-muted-foreground mb-2">
              ✉️ {address.email}
            </p>
          )}

          {address.company && (
            <p className="text-sm font-medium text-muted-foreground mb-2">
              🏢 {address.company}
            </p>
          )}

          <p className="text-sm leading-relaxed">
            {address.addressLine1 || address.street}
            {address.addressLine2 && `, ${address.addressLine2}`}
          </p>

          <p className="text-sm text-muted-foreground mt-1">
            {address.city}
            {address.stateProvince && `, ${address.stateProvince}`}
            {address.state && `, ${address.state}`} {address.postalCode}
          </p>

          <p className="text-sm text-muted-foreground font-medium">
            {countryName}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-muted"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};