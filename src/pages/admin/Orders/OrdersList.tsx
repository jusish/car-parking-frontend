import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/CommonComponents/PageHeader";
import { useDeleteSlotOrder, useSlotOrders } from "@/hooks/useSlotOrders";
import { DataTable, Column } from "@/components/DataTable/DataTable";
import { SlotOrder } from "@/api/slotOrderApi";
import { StatusBadge } from "@/components/CommonComponents/StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, Car, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ReactNode } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CreateOrder } from "./CreateOrder";
import { OrderDetails } from "./OrderDetails";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function OrdersList() {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [createModelOpen, setCreateModelOpen] = useState(false);
  const [orderDEtailsModelOpen, setOrderDEtailsModelOpen] = useState(false);
  const deletOrderMutation = useDeleteSlotOrder();

  const [selectedId, setSelectedId] = useState(null);

  const { data, isLoading } = useSlotOrders({
    page: pageIndex + 1,
    limit: pageSize,
  });

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
          <span className="font-semibold">
            {order.parkingSlot.parkingSlotNumber}
          </span>
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this order. This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteOrder(order.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];
  const handleDeleteOrder = (orderId: string) => {
    deletOrderMutation.mutate(orderId);
  };

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
