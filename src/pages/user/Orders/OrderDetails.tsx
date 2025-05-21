import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/CommonComponents/PageHeader";
import { useSlotOrder, useUpdateSlotOrderStatus } from "@/hooks/useSlotOrders";
import { SlotOrderStatus } from "@/api/slotOrderApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/CommonComponents/LoadingSpinner";
import { StatusBadge } from "@/components/CommonComponents/StatusBadge";
import { SlotSizeBadge } from "@/components/CommonComponents/SlotSizeBadge";
import { format } from "date-fns";
import { AlertCircle, Car, User, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function OrderDetails({
  open,
  openChange,
  selectedId,
}: {
  open: boolean;
  openChange: (open: boolean) => void;
  selectedId: string;
}) {
  const id = selectedId;
  const navigate = useNavigate();

  const { data: order, isLoading } = useSlotOrder(id || "");
  const updateStatusMutation = useUpdateSlotOrderStatus(id || "");

  const [status, setStatus] = useState<SlotOrderStatus | "">("");
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-bold mt-4">Order Not Found</h2>
        <p className="text-muted-foreground mt-2">
          The order you're looking for doesn't exist.
        </p>
        <Button className="mt-4" onClick={() => navigate("/dashboard/orders")}>
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 max-h-[500px] w-full  overflow-auto">
        <Card className="col-span-2 border-none w-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Parking Reservation</CardTitle>
              <StatusBadge status={order.parkingSlotOrderStatus} />
            </div>
            <CardDescription>
              Created on{" "}
              {format(new Date(order?.createdAt || ""), "MMMM dd, yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Order Information
                </h3>
                <div className="bg-muted/50 p-4 rounded-md space-y-3">
                  <div>
                    <p className="text-sm font-medium">Order ID</p>
                    <p className="text-sm">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <StatusBadge status={order.parkingSlotOrderStatus} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Created At</p>
                    <p className="text-sm flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(order.createdAt || ""), "PPpp")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(
                        new Date(order.updatedAt || order.createdAt || ""),
                        "PPpp"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Parking Slot
                </h3>
                {order.parkingSlot ? (
                  <div className="bg-muted/50 p-4 rounded-md space-y-3">
                    <div>
                      <p className="text-sm font-medium">Slot ID</p>
                      <p className="text-sm">{order.parkingSlot.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Size</p>
                      <SlotSizeBadge size={order.parkingSlot.parkingSlotSize} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <StatusBadge
                        status={order.parkingSlot.parkingSlotStatus}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted/50 p-4 rounded-md text-center">
                    <p className="text-sm text-muted-foreground">
                      Slot information not available
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Vehicle Information
              </h3>
              <div className="bg-muted/50 p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Plate Number</p>
                    <p className="text-sm flex items-center gap-1">
                      <Car className="h-3 w-3" />
                      {order.parkingSlotVehicle.id}
                    </p>
                  </div>
                  {order.parkingSlotVehicle && (
                    <>
                      <div>
                        <p className="text-sm font-medium">Vehicle</p>
                        <p className="text-sm">
                          {order.parkingSlotVehicle.vehicleBrand}{" "}
                          {order.parkingSlotVehicle.vehicleModel} (
                          {order.parkingSlotVehicle.vehicleYear})
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Type</p>
                        <p className="text-sm">
                          {order.parkingSlotVehicle.vehicleType}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Color</p>
                        <p className="text-sm">
                          {order.parkingSlotVehicle.vehicleColor}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
