import { ReactNode } from "react";

export interface NavItem {
  name: string;
  href: string;
  iconName: string;
  badge?: number;
}

export interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
}
