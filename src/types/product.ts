export type ProductCategory = 
  | 'all'
  | 'electronics'
  | 'apparel'
  | 'footwear'
  | 'leather-goods'
  | 'home-living'
  | 'beauty';

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
