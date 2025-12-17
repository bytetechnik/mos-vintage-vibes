// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { ProductCategory } from '@/types/product';
// import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

// // Mock API functions - replace with actual API calls
// const mockApi = {
//   getProducts: async (params?: {
//     search?: string;
//     category?: ProductCategory;
//     brand?: string;
//     condition?: number[];
//     price_min?: number;
//     price_max?: number;
//     featured?: boolean;
//     sort?: string;
//     page?: number;
//     per_page?: number;
//   }) => {
//     // Simulate API delay
//     await new Promise(resolve => setTimeout(resolve, 500));

//     // Import products data
//     const { products } = await import('@/data/products');

//     let filtered = [...products];

//     // Apply filters
//     if (params?.search) {
//       const query = params.search.toLowerCase();
//       filtered = filtered.filter(product =>
//         product.name.toLowerCase().includes(query) ||
//         product.brand.toLowerCase().includes(query) ||
//         product.category.toLowerCase().includes(query) ||
//         product.tags.some(tag => tag.toLowerCase().includes(query))
//       );
//     }

//     if (params?.category) {
//       filtered = filtered.filter(product => product.category === params.category);
//     }

//     if (params?.brand) {
//       filtered = filtered.filter(product => product.brand === params.brand);
//     }

//     if (params?.condition && params.condition.length > 0) {
//       filtered = filtered.filter(product =>
//         params.condition!.includes(product.condition.rating)
//       );
//     }

//     if (params?.price_min) {
//       filtered = filtered.filter(product => product.price >= params.price_min!);
//     }

//     if (params?.price_max) {
//       filtered = filtered.filter(product => product.price <= params.price_max!);
//     }

//     if (params?.featured) {
//       filtered = filtered.filter(product => product.featured);
//     }

//     // Apply sorting
//     if (params?.sort) {
//       switch (params.sort) {
//         case 'price-low':
//           filtered.sort((a, b) => a.price - b.price);
//           break;
//         case 'price-high':
//           filtered.sort((a, b) => b.price - a.price);
//           break;
//         case 'name':
//           filtered.sort((a, b) => a.name.localeCompare(b.name));
//           break;
//         case 'condition':
//           filtered.sort((a, b) => b.condition.rating - a.condition.rating);
//           break;
//         case 'newest':
//         default:
//           filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
//           break;
//       }
//     }

//     // Apply pagination
//     const page = params?.page || 1;
//     const perPage = params?.per_page || 20;
//     const start = (page - 1) * perPage;
//     const end = start + perPage;
//     const paginated = filtered.slice(start, end);

//     return {
//       data: paginated,
//       pagination: {
//         current_page: page,
//         per_page: perPage,
//         total: filtered.length,
//         total_pages: Math.ceil(filtered.length / perPage),
//         has_next: end < filtered.length,
//         has_prev: page > 1
//       }
//     };
//   },

//   getProduct: async (id: string) => {
//     await new Promise(resolve => setTimeout(resolve, 300));
//     const { products } = await import('@/data/products');
//     const product = products.find(p => p.id === id);
//     if (!product) throw new Error('Product not found');
//     return product;
//   },

//   getBrands: async () => {
//     await new Promise(resolve => setTimeout(resolve, 200));
//     const { brands } = await import('@/data/products');
//     return brands;
//   },

//   getCategories: async () => {
//     await new Promise(resolve => setTimeout(resolve, 200));
//     const { categoryNames } = await import('@/data/products');
//     return Object.entries(categoryNames).map(([key, name]) => ({ id: key, name }));
//   }
// };

// // Query keys
// export const productKeys = {
//   all: ['products'] as const,
//   lists: () => [...productKeys.all, 'list'] as const,
//   list: (filters: any) => [...productKeys.lists(), filters] as const,
//   details: () => [...productKeys.all, 'detail'] as const,
//   detail: (id: string) => [...productKeys.details(), id] as const,
//   brands: () => [...productKeys.all, 'brands'] as const,
//   categories: () => [...productKeys.all, 'categories'] as const,
// };

// // Hooks
// export const useProducts = (params?: {
//   search?: string;
//   category?: ProductCategory;
//   brand?: string;
//   condition?: number[];
//   price_min?: number;
//   price_max?: number;
//   featured?: boolean;
//   sort?: string;
//   page?: number;
//   per_page?: number;
// }) => {
//   return useQuery({
//     queryKey: productKeys.list(params),
//     queryFn: () => mockApi.getProducts(params),
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     gcTime: 10 * 60 * 1000, // 10 minutes
//   });
// };

// export const useInfiniteProducts = (params?: {
//   search?: string;
//   category?: ProductCategory;
//   brand?: string;
//   condition?: number[];
//   price_min?: number;
//   price_max?: number;
//   featured?: boolean;
//   sort?: string;
//   per_page?: number;
// }) => {
//   return useInfiniteQuery({
//     queryKey: productKeys.list(params),
//     queryFn: ({ pageParam = 1 }) =>
//       mockApi.getProducts({ ...params, page: pageParam as number }),
//     initialPageParam: 1,
//     getNextPageParam: (lastPage: any) =>
//       lastPage.pagination.has_next ? lastPage.pagination.current_page + 1 : undefined,
//     getPreviousPageParam: (firstPage: any) =>
//       firstPage.pagination.has_prev ? firstPage.pagination.current_page - 1 : undefined,
//     staleTime: 5 * 60 * 1000,
//     gcTime: 10 * 60 * 1000,
//   });
// };

// export const useProduct = (id: string) => {
//   return useQuery({
//     queryKey: productKeys.detail(id),
//     queryFn: () => mockApi.getProduct(id),
//     enabled: !!id,
//     staleTime: 10 * 60 * 1000, // 10 minutes
//     gcTime: 30 * 60 * 1000, // 30 minutes
//   });
// };

// export const useBrands = () => {
//   return useQuery({
//     queryKey: productKeys.brands(),
//     queryFn: mockApi.getBrands,
//     staleTime: 30 * 60 * 1000, // 30 minutes
//     gcTime: 60 * 60 * 1000, // 1 hour
//   });
// };

// export const useCategories = () => {
//   return useQuery({
//     queryKey: productKeys.categories(),
//     queryFn: mockApi.getCategories,
//     staleTime: 30 * 60 * 1000, // 30 minutes
//     gcTime: 60 * 60 * 1000, // 1 hour
//   });
// }; 