export type ServiceStatus = "AVAILABLE_NOW" | "COMING_SOON" | "CUSTOM_QUOTE";

export interface Service {
  id: string;
  title: string;
  description: string;
  status: ServiceStatus;
  startingPrice?: number;
  isRecurring?: boolean;
  category: "web" | "app" | "software" | "game" | "ai" | "marketing" | "infrastructure";
}

export const services: Service[] = [
  {
    id: "web",
    title: "Website Development",
    description: "Professional business websites, e-commerce, and custom web experiences.",
    status: "AVAILABLE_NOW",
    startingPrice: 25000,
    category: "web",
  },
  {
    id: "app",
    title: "Web & Mobile Applications",
    description: "Cross-platform applications designed around specific business requirements.",
    status: "AVAILABLE_NOW",
    startingPrice: 35000,
    category: "app",
  },
  {
    id: "software",
    title: "Custom Software",
    description: "Internal business systems, platforms, automation tools, and software.",
    status: "AVAILABLE_NOW",
    startingPrice: 35000,
    category: "software",
  },
  {
    id: "ai-integration",
    title: "AI Integration",
    description: "Integrate LLMs, AI-powered features, and intelligent automation into your business.",
    status: "AVAILABLE_NOW",
    startingPrice: 7500,
    category: "ai",
  },
  {
    id: "game",
    title: "Game Development",
    description: "2D, 3D, and interactive web/mobile game development.",
    status: "AVAILABLE_NOW",
    startingPrice: 25000,
    category: "game",
  },
  {
    id: "marketing",
    title: "Marketing Plans",
    description: "Marketing planning, brand positioning, and digital growth strategy.",
    status: "AVAILABLE_NOW",
    startingPrice: 3500,
    category: "marketing",
  },
  {
    id: "existing-project",
    title: "Existing Project Support",
    description: "Continuation, bug fixing, modernization, and feature development for existing codebases.",
    status: "CUSTOM_QUOTE",
    category: "software",
  },
  {
    id: "hosting",
    title: "Hosting & Deployment",
    description: "Secure application deployment, cloud architecture, and ongoing managed hosting.",
    status: "CUSTOM_QUOTE",
    isRecurring: true,
    category: "infrastructure",
  },
  {
    id: "consultation",
    title: "Technical Consultation",
    description: "Expert technical guidance, architecture review, and feasibility analysis.",
    status: "AVAILABLE_NOW",
    category: "software",
  },
  // COMING SOON
  {
    id: "ai-call-center",
    title: "AI Call Center",
    description: "Automated, intelligent voice agents for inbound and outbound call handling.",
    status: "COMING_SOON",
    category: "ai",
  },
  {
    id: "ai-sales-automation",
    title: "AI Sales Systems",
    description: "Streamline and automate your sales pipeline with artificial intelligence.",
    status: "COMING_SOON",
    category: "ai",
  },
  {
    id: "media-marketing",
    title: "Media Marketing",
    description: "Targeted media campaigns and social media digital advertising.",
    status: "COMING_SOON",
    category: "marketing",
  },
  {
    id: "ai-customer-support",
    title: "AI Customer Support",
    description: "24/7 intelligent customer support agents trained on your business data.",
    status: "COMING_SOON",
    category: "ai",
  },
  {
    id: "advanced-automation",
    title: "Business Automation",
    description: "End-to-end operational automation systems linking multiple platforms.",
    status: "COMING_SOON",
    category: "infrastructure",
  }
];