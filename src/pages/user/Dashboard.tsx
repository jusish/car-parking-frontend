import { useEffect, useState } from "react";
import { useSlots } from "@/hooks/useSlots";
import { useUserVehicles, useVehicles } from "@/hooks/useVehicles";
import { useSlotOrders, useUserSlotOrders } from "@/hooks/useSlotOrders";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/CommonComponents/PageHeader";
import { Car, Package, Clock } from "lucide-react";
import { LoadingSpinner } from "@/components/CommonComponents/LoadingSpinner";

export function UserDashboard() {
  const { user } = useAuth();
  console.log(user);
  const { data: slotsData, isLoading: slotsLoading } = useSlots({ limit: 100 });
  const { data: vehiclesData, isLoading: vehiclesLoading } = useUserVehicles({
    limit: 100,
  });
  const { data: ordersData, isLoading: ordersLoading } = useUserSlotOrders(
    user?.id || "",
    { limit: 100 }
  );
  const [stats, setStats] = useState({
    availableSlots: 0,
    myVehicles: 0,
    activeOrders: 0,
  });

  useEffect(() => {
    if (slotsData?.data) {
      const available = slotsData.data.filter(
        (slot) => slot.parkingSlotStatus === "AVAILABLE"
      ).length;

      setStats((prev) => ({
        ...prev,
        availableSlots: available,
      }));
    }
  }, [slotsData]);

  useEffect(() => {
    if (vehiclesData?.data) {
      const myVehicles = vehiclesData.data.filter(
        (vehicle) => vehicle.userId === user?.id
      ).length;
      setStats((prev) => ({
        ...prev,
        myVehicles: myVehicles || vehiclesData.data.length,
      }));
    }
  }, [vehiclesData, user]);

  useEffect(() => {
    if (ordersData?.data) {
      const userOrders = ordersData.data.filter(
        (order) => order.userId === user?.id
      );
      const active = userOrders.filter(
        (order) =>
          order.parkingSlotOrderStatus === "PENDING" ||
          order.parkingSlotOrderStatus === "APPROVED"
      ).length;

      setStats((prev) => ({
        ...prev,
        activeOrders: active,
      }));
    }
  }, [ordersData, user]);

  const isLoading = slotsLoading || vehiclesLoading || ordersLoading;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user?.firstName || "User"}!`}
        description="Here's an overview of your parking details."
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Available Slots
                </CardTitle>
                <Package className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.availableSlots}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Ready for booking
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  My Vehicles
                </CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.myVehicles}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Registered vehicles
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Orders
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeOrders}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Pending or approved
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
