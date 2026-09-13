export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  link?: string;
}

export const portfolioItems: PortfolioItem[] = [];