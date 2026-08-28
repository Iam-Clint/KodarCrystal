import { memo } from "react";
import type { IconType } from "react-icons";
import {
  SiApple,
  SiCloudflare,
  SiFigma,
  SiFirebase,
  SiFlutter,
  SiGithub,
  SiGoogle,
  SiHtml5,
  SiLinear,
  SiN8N,
  SiNetlify,
  SiNotion,
  SiReact,
  SiResend,
  SiSentry,
  SiSlack,
  SiStripe,
  SiSupabase,
  SiVercel,
} from "react-icons/si";
import { Server } from "lucide-react";

type Brand = {
  Icon: IconType | typeof Server;
  /** Official brand colour; used unless `mono` is requested. */
  color: string;
};

const BRANDS: Record<string, Brand> = {
  google: { Icon: SiGoogle, color: "#4285F4" },
  apple: { Icon: SiApple, color: "#000000" },
  github: { Icon: SiGithub, color: "#181717" },
  vercel: { Icon: SiVercel, color: "#000000" },
  netlify: { Icon: SiNetlify, color: "#00C7B7" },
  cloudflare: { Icon: SiCloudflare, color: "#F38020" },
  supabase: { Icon: SiSupabase, color: "#3FCF8E" },
  firebase: { Icon: SiFirebase, color: "#FFCA28" },
  n8n: { Icon: SiN8N, color: "#EA4B71" },
  notion: { Icon: SiNotion, color: "#000000" },
  linear: { Icon: SiLinear, color: "#5E6AD2" },
  stripe: { Icon: SiStripe, color: "#635BFF" },
  figma: { Icon: SiFigma, color: "#F24E1E" },
  sentry: { Icon: SiSentry, color: "#362D59" },
  slack: { Icon: SiSlack, color: "#4A154B" },
  resend: { Icon: SiResend, color: "#000000" },
  react: { Icon: SiReact, color: "#61DAFB" },
  flutter: { Icon: SiFlutter, color: "#02569B" },
  html: { Icon: SiHtml5, color: "#E34F26" },
  custom: { Icon: Server, color: "currentColor" },
};

export type BrandId = keyof typeof BRANDS;

/** Renders the real brand logo for a third-party service. */
export const BrandIcon = memo(function BrandIcon({
  id,
  className = "h-4 w-4",
  mono = false,
}: {
  id: string;
  className?: string;
  mono?: boolean;
}) {
  const brand = BRANDS[id] ?? BRANDS.custom;
  const Icon = brand.Icon;
  const color = mono || brand.color === "currentColor" ? undefined : brand.color;
  return (
    <Icon
      aria-hidden="true"
      className={`${className} ${color ? "dark:brightness-125" : ""}`}
      style={color ? { color } : undefined}
    />
  );
});
