import { useEffect, useState } from "react";
import { useSlots } from "@/hooks/useSlots";
import { useUserVehicles, useVehicles } from "@/hooks/useVehicles";
import { useSlotOrders } from "@/hooks/useSlotOrders";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/CommonComponents/PageHeader";
import { ParkingSlotSize, ParkingSlotStatus } from "@/api/slotApi";
import { Car, Package, Users, AlertCircle, Clock } from "lucide-react";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { LoadingSpinner } from "@/components/CommonComponents/LoadingSpinner";

export function Dashboard() {
  const { user } = useAuth();
  const { data: slotsData, isLoading: slotsLoading } = useSlots({ limit: 100 });
  const { data: vehiclesData, isLoading: vehiclesLoading } = useVehicles({
    limit: 100,
  });
  const { data: ordersData, isLoading: ordersLoading } = useSlotOrders({
    limit: 100,
  });

  // Stats
  const [stats, setStats] = useState({
    totalSlots: 0,
    availableSlots: 0,
    occupiedSlots: 0,
    totalVehicles: 0,
    activeOrders: 0,
  });

  // Chart data for slot sizes
  const [slotSizeData, setSlotSizeData] = useState<
    { name: string; count: number }[]
  >([]);

  // Chart data for slot statuses
  const [slotStatusData, setSlotStatusData] = useState<
    { name: ParkingSlotStatus; count: number }[]
  >([]);

  useEffect(() => {
    if (slotsData?.data) {
      const available = slotsData.data.filter(
        (slot) => slot.parkingSlotStatus === "AVAILABLE"
      ).length;
      const occupied = slotsData.data.filter(
        (slot) => slot.parkingSlotStatus === "OCCUPIED"
      ).length;
      const maintenance = slotsData.data.filter(
        (slot) => slot.parkingSlotStatus === "MAINTENANCE"
      ).length;

      // Count slots by size
      const sizeCount: Record<ParkingSlotSize, number> = {
        SMALL: 0,
        MEDIUM: 0,
        LARGE: 0,
      };

      slotsData.data.forEach((slot) => {
        sizeCount[slot.parkingSlotSize] += 1;
      });

      const sizeData = Object.entries(sizeCount).map(([name, count]) => ({
        name,
        count,
      }));

      const statusData = [
        { name: "AVAILABLE" as ParkingSlotStatus, count: available },
        { name: "OCCUPIED" as ParkingSlotStatus, count: occupied },
        { name: "MAINTENANCE" as ParkingSlotStatus, count: maintenance },
      ];

      setStats((prev) => ({
        ...prev,
        totalSlots: slotsData.totalItems,
        availableSlots: available,
        occupiedSlots: occupied,
      }));

      setSlotSizeData(sizeData);
      setSlotStatusData(statusData);
    }
  }, [slotsData]);

  useEffect(() => {
    if (vehiclesData?.data) {
      setStats((prev) => ({
        ...prev,
        totalVehicles: vehiclesData.totalItems,
      }));
    }
  }, [vehiclesData]);

  useEffect(() => {
    if (ordersData?.data) {
      const active = ordersData.data.filter(
        (order) =>
          order.parkingSlotOrderStatus === "PENDING" ||
          order.parkingSlotOrderStatus === "APPROVED"
      ).length;

      setStats((prev) => ({
        ...prev,
        activeOrders: active,
      }));
    }
  }, [ordersData]);

  const isLoading = slotsLoading || vehiclesLoading || ordersLoading;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user?.firstName || "User"}!`}
        description="Here's an overview of your parking system."
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Slots
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSlots}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.availableSlots} available, {stats.occupiedSlots}{" "}
                  occupied
                </p>
              </CardContent>
            </Card>

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
                  {Math.round(
                    (stats.availableSlots / stats.totalSlots) * 100
                  ) || 0}
                  % of total capacity
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Registered Vehicles
                </CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalVehicles}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  In the system
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Slots by Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={slotSizeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="count"
                        name="Number of Slots"
                        fill="#3B82F6"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Slots by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={slotStatusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="count"
                        name="Number of Slots"
                        fill="#10B981"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
