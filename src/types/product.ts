export type ProductCategory = 
  | 'all'
  | 'electronics'
  | 'apparel'
  | 'footwear'
  | 'leather-goods'
  | 'home-living'
  | 'beauty'
  | (string & {});

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isCustom?: boolean;
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'cat-electronics', name: 'Electronics & Audio', slug: 'electronics', description: 'Flagship audio, smart devices, and accessories' },
  { id: 'cat-apparel', name: 'Apparel & Fashion', slug: 'apparel', description: 'Designer menswear, womenswear, and outerwear' },
  { id: 'cat-footwear', name: 'Footwear & Boots', slug: 'footwear', description: 'Handmade Italian boots, sneakers, and loafers' },
  { id: 'cat-leather-goods', name: 'Leather Goods & Bags', slug: 'leather-goods', description: 'Full-grain Tuscan calfskin bags, wallets, and belts' },
  { id: 'cat-home-living', name: 'Home & Living', slug: 'home-living', description: 'Minimalist decor, acoustics, and lifestyle accents' },
  { id: 'cat-beauty', name: 'Beauty & Wellness', slug: 'beauty', description: 'Luxury skincare, fragrances, and wellness' },
];

export interface ProductVariantColor {
  name: string;
  hex: string;
  imageIndex?: number;
}

export interface ProductVariantSize {
  name: string;
  stock: number;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: ProductCategory;
  brand?: string; // 'JUDES' for in-house brand, or supplier brand
  profit?: number; // Estimated profit in INR (Rs)
  drawTier?: 'platinum' | 'gold' | 'silver' | 'tier-1' | 'tier-2' | 'tier-3'; // Platinum: >500, Gold: 250-500, Silver: 100-250
  isBumperEligible?: boolean; // True for JudesCart's own brand JUDES (6-12 month draw)
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  colors: ProductVariantColor[];
  sizes: ProductVariantSize[];
  badge?: 'New' | 'Bestseller' | 'Limited Edition' | 'Sale' | 'Top Rated';
  isFeatured?: boolean;
  details: {
    materials: string;
    origin: string;
    care: string;
    sustainability: string;
  };
  reviews: ProductReview[];
}

export interface FilterState {
  category: ProductCategory;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  searchQuery: string;
  brand?: string;
  drawTier?: 'all' | 'platinum' | 'gold' | 'silver' | 'tier-1' | 'tier-2' | 'tier-3' | 'bumper';
}
