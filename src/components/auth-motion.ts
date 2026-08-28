import type { Variants, Transition } from "framer-motion";

/** Hoisted so hot auth components don't rebuild config objects each render. */
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.985 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -12, scale: 0.985, transition: { duration: 0.2 } },
};

export const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: "easeOut" } },
};

export const oauthVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, delay: 0.18, ease: "easeOut" } },
};

export const errorVariants: Variants = {
  hidden: { opacity: 0, height: 0, y: -4 },
  show: { opacity: 1, height: "auto", y: 0 },
  exit: { opacity: 0, height: 0, y: -4 },
};

export const errorTransition: Transition = { duration: 0.22, ease: "easeOut" };

/** Shared responsive shell classes for the auth card. */
export const authCardClass =
  "surface relative w-full max-w-[420px] rounded-2xl p-5 sm:max-w-md sm:rounded-3xl sm:p-8 md:max-w-lg md:p-10 lg:max-w-md lg:p-8";
export const authFieldClass =
  "surface flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-2.5";
export const authInputClass =
  "w-full min-w-0 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground sm:text-sm";
