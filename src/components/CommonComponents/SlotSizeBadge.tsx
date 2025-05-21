import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ParkingSlotSize } from "@/api/slotApi";

interface SlotSizeBadgeProps {
  size: ParkingSlotSize;
  className?: string;
}

export function SlotSizeBadge({ size, className }: SlotSizeBadgeProps) {
  const getVariantBySize = () => {
    switch (size) {
      case "SMALL":
        return "bg-blue-500 hover:bg-blue-500/80";
      case "MEDIUM":
        return "bg-purple-500 hover:bg-purple-500/80";
      case "LARGE":
        return "bg-orange-500 hover:bg-orange-500/80";
      default:
        return "";
    }
  };

  return (
    <Badge className={cn(getVariantBySize(), "text-white", className)}>
      {size}
    </Badge>
  );
}
