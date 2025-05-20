import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ParkingSlotStatus } from "@/api/slotApi";
import { SlotOrderStatus } from "@/api/slotOrderApi";

interface StatusBadgeProps {
  status: ParkingSlotStatus | SlotOrderStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getVariantByStatus = () => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-500 hover:bg-green-500/80";
      case "OCCUPIED":
        return "bg-red-500 hover:bg-red-500/80";
      case "MAINTENANCE":
        return "bg-yellow-500 hover:bg-yellow-500/80";
      case "PENDING":
        return "bg-blue-500 hover:bg-blue-500/80";
      case "APPROVED":
        return "bg-green-500 hover:bg-green-500/80";
      case "REJECTED":
        return "bg-red-500 hover:bg-red-500/80";
      case "COMPLETED":
        return "bg-gray-500 hover:bg-gray-500/80";
      default:
        return "";
    }
  };

  return (
    <Badge className={cn(getVariantByStatus(), "text-white", className)}>
      {status}
    </Badge>
  );
}
