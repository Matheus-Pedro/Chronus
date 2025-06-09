import { icons, LucideIcon } from "lucide-react";

interface IconProps {
  name: keyof typeof icons;
  color?: string;
  size?: number;
  className?: string;
}

export const Icon = ({ name, color, size = 24, className }: IconProps) => {
  const LucideIcon = icons[name] as LucideIcon;

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react icons`);
    return null;
  }

  return <LucideIcon color={color} size={size} className={className} />;
};
