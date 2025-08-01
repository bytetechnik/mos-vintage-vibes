import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Upload, 
  X, 
  Package,
  DollarSign,
  Hash,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  comparePrice: number;
  cost: number;
  sku: string;
  barcode: string;
  stock: number;
  lowStockThreshold: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  status: 'active' | 'inactive' | 'draft';
  featured: boolean;
  images: string[];
  tags: string[];
  variants: Array<{
    name: string;
    options: string[];
  }>;
}

interface AddProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<ProductFormData, 'id'>) => void;
}

const AddProductForm = ({ isOpen, onClose, onSubmit }: AddProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    brand: '',
    price: 0,
    comparePrice: 0,
    cost: 0,
    sku: '',
    barcode: '',
    stock: 0,
    lowStockThreshold: 10,
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    status: 'active',
    featured: false,
    images: [],
    tags: [],
    variants: [],
  });

  const [newTag, setNewTag] = useState('');
  const [newVariantName, setNewVariantName] = useState('');
  const [newVariantOption, setNewVariantOption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const categories = [
    'Sneakers', 'Running', 'Streetwear', 'Outerwear', 'Accessories', 
    'T-Shirts', 'Hoodies', 'Jackets', 'Pants', 'Shorts', 'Hats', 'Bags'
  ];

  const brands = [
    'Nike', 'Adidas', 'Supreme', 'Stone Island', 'Off-White', 'Carhartt',
    'Palace', 'Bape', 'Stussy', 'Champion', 'The North Face', 'Vans'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDimensionChange = (dimension: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: value
      }
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddVariant = () => {
    if (newVariantName.trim() && newVariantOption.trim()) {
      const existingVariant = formData.variants.find(v => v.name === newVariantName.trim());
      
      if (existingVariant) {
        // Add option to existing variant
        setFormData(prev => ({
          ...prev,
          variants: prev.variants.map(v => 
            v.name === newVariantName.trim() 
              ? { ...v, options: [...v.options, newVariantOption.trim()] }
              : v
          )
        }));
      } else {
        // Create new variant
        setFormData(prev => ({
          ...prev,
          variants: [...prev.variants, {
            name: newVariantName.trim(),
            options: [newVariantOption.trim()]
          }]
        }));
      }
      setNewVariantOption('');
    }
  };

  const handleRemoveVariant = (variantName: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter(v => v.name !== variantName)
    }));
  };

  const handleRemoveVariantOption = (variantName: string, option: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map(v => 
        v.name === variantName 
          ? { ...v, options: v.options.filter(o => o !== option) }
          : v
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.category || !formData.brand || formData.price <= 0) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields (name, category, brand, price).",
          variant: "destructive",
        });
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      onSubmit(formData);
      
      toast({
        title: "Product Added",
        description: "Product has been successfully added to inventory.",
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        brand: '',
        price: 0,
        comparePrice: 0,
        cost: 0,
        sku: '',
        barcode: '',
        stock: 0,
        lowStockThreshold: 10,
        weight: 0,
        dimensions: { length: 0, width: 0, height: 0 },
        status: 'active',
        featured: false,
        images: [],
        tags: [],
        variants: [],
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            Add New Product
          </DialogTitle>
          <DialogDescription>
            Fill in the product details below. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-4 w-4" />
                Basic Information
              </CardTitle>
              <CardDescription>Essential product details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    placeholder="Stock Keeping Unit"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Product description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="brand">Brand *</Label>
                  <Select value={formData.brand} onValueChange={(value) => handleInputChange('brand', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                Pricing & Inventory
              </CardTitle>
              <CardDescription>Product pricing and stock information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="comparePrice">Compare Price</Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    step="0.01"
                    value={formData.comparePrice}
                    onChange={(e) => handleInputChange('comparePrice', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="cost">Cost</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    value={formData.lowStockThreshold}
                    onChange={(e) => handleInputChange('lowStockThreshold', parseInt(e.target.value) || 0)}
                    placeholder="10"
                  />
                </div>
                <div>
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    value={formData.barcode}
                    onChange={(e) => handleInputChange('barcode', e.target.value)}
                    placeholder="Barcode"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Physical Attributes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Hash className="mr-2 h-4 w-4" />
                Physical Attributes
              </CardTitle>
              <CardDescription>Product dimensions and weight</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="length">Length (cm)</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.1"
                    value={formData.dimensions.length}
                    onChange={(e) => handleDimensionChange('length', parseFloat(e.target.value) || 0)}
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <Label htmlFor="width">Width (cm)</Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.1"
                    value={formData.dimensions.width}
                    onChange={(e) => handleDimensionChange('width', parseFloat(e.target.value) || 0)}
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    value={formData.dimensions.height}
                    onChange={(e) => handleDimensionChange('height', parseFloat(e.target.value) || 0)}
                    placeholder="0.0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Tags
              </CardTitle>
              <CardDescription>Add tags to help categorize and search for this product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Product Variants</CardTitle>
              <CardDescription>Add product variants like size, color, etc.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newVariantName}
                  onChange={(e) => setNewVariantName(e.target.value)}
                  placeholder="Variant name (e.g., Size, Color)"
                />
                <Input
                  value={newVariantOption}
                  onChange={(e) => setNewVariantOption(e.target.value)}
                  placeholder="Option (e.g., Large, Red)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddVariant())}
                />
                <Button type="button" onClick={handleAddVariant} variant="outline">
                  Add
                </Button>
              </div>
              {formData.variants.length > 0 && (
                <div className="space-y-3">
                  {formData.variants.map((variant) => (
                    <div key={variant.name} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{variant.name}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveVariant(variant.name)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {variant.options.map((option) => (
                          <Badge key={option} variant="outline" className="flex items-center gap-1">
                            {option}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-3 w-3 p-0"
                              onClick={() => handleRemoveVariantOption(variant.name, option)}
                            >
                              <X className="h-2 w-2" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status & Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Settings</CardTitle>
              <CardDescription>Product visibility and status settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange('featured', checked)}
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding Product...' : 'Add Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductForm; 