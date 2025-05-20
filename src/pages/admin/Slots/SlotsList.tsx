import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/CommonComponents/PageHeader";
import { useSlots, useDeleteSlot } from "@/hooks/useSlots";
import { DataTable, Column } from "@/components/DataTable/DataTable";
import { Slot, ParkingSlotSize, ParkingSlotStatus } from "@/api/slotApi";
import { SlotSizeBadge } from "@/components/CommonComponents/SlotSizeBadge";
import { StatusBadge } from "@/components/CommonComponents/StatusBadge";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditSlotModal } from "./EditSlot";
import { CreateSlotModal } from "./CreateSlotModal";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { BulkCreateSlots } from "./BulkCreateSlots";

export function SlotsList() {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedSlotSize, setSelectedSlotSize] =
    useState<ParkingSlotSize | null>(null);
  const [selectedSlotStatus, setSelectedSlotStatus] =
    useState<ParkingSlotStatus | null>(null);
  const [multipleModalOpen, setMultipleModalOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<Slot | null>(null);
  const [slotToEdit, setSlotToEdit] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const deleteSlotMutation = useDeleteSlot();

  const { data, isLoading } = useSlots({
    page: pageIndex + 1,
    limit: pageSize,
    search,
    slotSize: selectedSlotSize || undefined,
    slotStatus: selectedSlotStatus || undefined,
  });

  const handleDeleteClick = (slot: Slot) => {
    setSlotToDelete(slot);
  };

  const handleConfirmDelete = async () => {
    if (slotToDelete) {
      try {
        await deleteSlotMutation.mutateAsync(slotToDelete.id);
        setSlotToDelete(null);
        toast.success(`Slot deleted successfully`);
      } catch (error) {
        toast.error("Failed to delete slot");
      }
    }
  };

  const handleBulkCreateClick = () => {
    navigate("/dashboard/slots/bulk-create");
  };

  const handleEditClick = (slotId: string) => {
    setSlotToEdit(slotId);
  };

  const columns: Column<Slot>[] = [
    {
      header: "Number",
      accessorKey: "parkingSlotNumber",
    },
    {
      header: "Size",
      accessorKey: "slotSize",
      cell: (slot) => <SlotSizeBadge size={slot.parkingSlotSize} />,
      sortable: true,
    },
    {
      header: "Status",
      accessorKey: "slotStatus",
      cell: (slot) => <StatusBadge status={slot.parkingSlotStatus} />,
      sortable: true,
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: (slot) =>
        format(new Date(slot.createdAt || ""), "MMM dd, yyyy HH:mm"),
      sortable: true,
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (slot) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleEditClick(slot.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => handleDeleteClick(slot)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleSlotSizeChange = (value: string) => {
    setSelectedSlotSize(value === "all" ? null : (value as ParkingSlotSize));
  };

  const handleSlotStatusChange = (value: string) => {
    setSelectedSlotStatus(
      value === "all" ? null : (value as ParkingSlotStatus)
    );
  };

  return (
    <>
      <PageHeader
        title="Parking Slots"
        description="Manage your parking slots"
        actionLabel="Create Slot"
        onAction={() => setIsCreateModalOpen(true)}
      />

      <div className="mb-4 flex flex-wrap justify-end gap-4 items-center">
        <Dialog open={multipleModalOpen} onOpenChange={setMultipleModalOpen}>
          <DialogTrigger>
            <Button variant="outline" className="ml-auto">
              Create Multiple Slots
            </Button>
          </DialogTrigger>
          <DialogContent>
            <BulkCreateSlots
              open={multipleModalOpen}
              openChange={setMultipleModalOpen}
            />
          </DialogContent>
        </Dialog>

        <Select
          value={selectedSlotSize ? selectedSlotSize : "all"}
          onValueChange={handleSlotSizeChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sizes</SelectItem>
            <SelectItem value="SMALL">Small</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="LARGE">Large</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={selectedSlotStatus ? selectedSlotStatus : "all"}
          onValueChange={handleSlotStatusChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="AVAILABLE">Available</SelectItem>
            <SelectItem value="OCCUPIED">Occupied</SelectItem>
            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!slotToDelete}
        onOpenChange={(open) => !open && setSlotToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this parking slot? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSlotToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Slot Modal */}
      {slotToEdit && (
        <EditSlotModal
          slotId={slotToEdit}
          isOpen={!!slotToEdit}
          onClose={() => setSlotToEdit(null)}
        />
      )}

      {/* Create Slot Modal */}
      <CreateSlotModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
