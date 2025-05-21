import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/CommonComponents/PageHeader";
import { useSlotOrders, useUserSlotOrders } from "@/hooks/useSlotOrders";
import { DataTable, Column } from "@/components/DataTable/DataTable";
import { SlotOrder } from "@/api/slotOrderApi";
import { StatusBadge } from "@/components/CommonComponents/StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, Car } from "lucide-react";
import { format } from "date-fns";
import { ReactNode } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CreateOrder } from "./CreateOrder";
import { OrderDetails } from "./OrderDetails";
import { useAuth } from "@/hooks/useAuth";

export function UserOrdersList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [createModelOpen, setCreateModelOpen] = useState(false);
  const [orderDEtailsModelOpen, setOrderDEtailsModelOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const { data, isLoading } = useUserSlotOrders(user?.id || "", {
    page: pageIndex + 1,
    limit: pageSize,
  });
  console.log(data);

  const handleCreateClick = () => {
    setCreateModelOpen(true);
  };

  const columns: Column<SlotOrder>[] = [
    {
      header: "Order ID",
      accessorKey: "id",
    },
    {
      header: "Slot Number",
      accessorKey: "slotId",
      cell: (order) => (
        <div>
          <span className="font-semibold">{order.parkingSlot.parkingSlotNumber}</span>
        </div>
      ),
    },
    {
      header: "Vehicle",
      accessorKey: "vehiclePlateNumber",
      cell: (order) => (
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4" />
          <span>{order.parkingSlotVehicle?.vehiclePlateNumber ?? ""}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (order) => <StatusBadge status={order.parkingSlotOrderStatus} />,
      sortable: true,
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: (order) =>
        format(new Date(order.createdAt || ""), "MMM dd, yyyy HH:mm"),
      sortable: true,
    },
    {
      header: "Actions",
      // Fix: Change the accessor to be a string key or a function that returns ReactNode
      accessorKey: "id",
      cell: (order) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSelectedId(order.id);
              setOrderDEtailsModelOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Parking Orders"
        description="Manage parking slot reservations"
        actionLabel="Create Order"
        onAction={handleCreateClick}
      />
      <Dialog open={createModelOpen} onOpenChange={setCreateModelOpen}>
        <DialogContent>
          <CreateOrder open={createModelOpen} openChange={setCreateModelOpen} />
        </DialogContent>
      </Dialog>
      <Dialog
        open={orderDEtailsModelOpen}
        onOpenChange={setOrderDEtailsModelOpen}
      >
        <DialogContent>
          <OrderDetails
            selectedId={selectedId}
            open={orderDEtailsModelOpen}
            openChange={setOrderDEtailsModelOpen}
          />
        </DialogContent>
      </Dialog>

      <DataTable
        columns={columns}
        data={data?.data || []}
        totalItems={data?.totalItems || 0}
        pageSize={pageSize}
        pageIndex={pageIndex}
        onPageChange={setPageIndex}
        onPageSizeChange={setPageSize}
        onSearch={setSearch}
        isLoading={isLoading}
      />
    </>
  );
}
