export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  cpu: string;
  generation: string;
  ram: string;
  storage: string;
  display?: string;
  description: string;
  image: string;
  images?: string[];
  stock: number;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Gaming Beast Pro",
    brand: "Pitory",
    category: "Gaming",
    price: 1299.99,
    cpu: "Intel Core i7-13700K",
    generation: "13th Gen",
    ram: "32GB DDR4",
    storage: "1TB NVMe SSD",
    display: "27\" 144Hz",
    description: "Ultimate gaming powerhouse designed for 4K gaming and streaming. Features the latest Intel processor with advanced cooling system.",
    image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=500&h=400&fit=crop"
    ],
    stock: 15
  },
  {
    id: "2",
    name: "Office Elite",
    brand: "Pitory",
    category: "Work",
    price: 799.99,
    cpu: "Intel Core i5-13600K",
    generation: "13th Gen",
    ram: "16GB DDR4",
    storage: "512GB NVMe SSD",
    display: "24\" IPS",
    description: "Perfect for productivity and business tasks. Optimized for multitasking with excellent energy efficiency.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1484807352052-23338990c6c6?w=500&h=400&fit=crop"
    ],
    stock: 25
  },
  {
    id: "3",
    name: "Creator Station",
    brand: "Pitory",
    category: "Creative",
    price: 1599.99,
    cpu: "AMD Ryzen 9 7900X",
    generation: "7th Gen",
    ram: "64GB DDR5",
    storage: "2TB NVMe SSD",
    display: "32\" 4K",
    description: "Content creator's dream machine with massive RAM and storage for video editing, 3D rendering, and graphic design.",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=500&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1572649688792-37ed7f46ba76?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1515378791036-0648a814c963?w=500&h=400&fit=crop"
    ],
    stock: 8
  },
  {
    id: "4",
    name: "Budget Starter",
    brand: "Pitory",
    category: "General Use",
    price: 499.99,
    cpu: "Intel Core i3-13100",
    generation: "13th Gen",
    ram: "8GB DDR4",
    storage: "256GB NVMe SSD",
    display: "21.5\" HD",
    description: "Affordable computer for everyday tasks like browsing, email, and light productivity work.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1493421419110-74f4e85ba126?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1585079542156-2755d9c8a094?w=500&h=400&fit=crop"
    ],
    stock: 30
  },
  {
    id: "5",
    name: "Gaming Pro Max",
    brand: "Pitory",
    category: "Gaming",
    price: 1899.99,
    cpu: "AMD Ryzen 9 7950X",
    generation: "7th Gen",
    ram: "32GB DDR5",
    storage: "2TB NVMe SSD",
    display: "34\" Ultrawide 144Hz",
    description: "Top-tier gaming machine with the most powerful AMD processor and ultrawide display for immersive gaming.",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1515378791036-0648a814c963?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1592872891720-5d6bcf9b6ba4?w=500&h=400&fit=crop"
    ],
    stock: 12
  },
  {
    id: "6",
    name: "Home Office Plus",
    brand: "Pitory",
    category: "Work",
    price: 899.99,
    cpu: "Intel Core i7-13700",
    generation: "13th Gen",
    ram: "16GB DDR4",
    storage: "1TB NVMe SSD",
    display: "27\" IPS",
    description: "Enhanced home office setup with larger display and faster processor for demanding work applications.",
    image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=500&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&h=400&fit=crop"
    ],
    stock: 20
  }
];

export const categories = ["All", "Desktop", "Laptop", "Accessories", "Printer", "Networking"];