declare module "framer-motion" {
  import * as React from "react";
  export const AnimatePresence: React.ComponentType<{ children?: React.ReactNode; mode?: string }>;
  export const motion: any;
  export function useScroll(): { scrollY: any };
  export function useTransform(...args: any[]): any;
}
