export interface Banner {
  id: string;
  title: string;
  titleBn: string;
  subtitle: string;
  subtitleBn: string;
  badgeText: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  sequence: number; // 1, 2, 3...
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
