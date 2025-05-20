import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/CommonComponents/PageHeader";
import { useDeleteVehicle, useUserVehicles } from "@/hooks/useVehicles";
import { DataTable, Column } from "@/components/DataTable/DataTable";
import { Vehicle } from "@/api/vehicleApi";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Car } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { CreateVehicle } from "./CreateVehicle";
import { EditVehicle } from "./EditVehicle";

export function UserVehiclesList() {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editModelOpen, setEditModelOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const deleteVehicleMutation = useDeleteVehicle();

  const { data, isLoading } = useUserVehicles({
    page: pageIndex + 1,
    limit: pageSize,
    search,
  });

  const handleDeleteClick = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
  };

  const handleConfirmDelete = async () => {
    if (vehicleToDelete) {
      try {
        await deleteVehicleMutation.mutateAsync(vehicleToDelete.id);
        setVehicleToDelete(null);
        toast.success(`Vehicle deleted successfully`);
      } catch (error) {
        toast.error("Failed to delete vehicle");
      }
    }
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const columns: Column<Vehicle>[] = [
    {
      header: "Plate Number",
      accessorKey: "vehiclePlateNumber",
      cell: (vehicle) => (
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4" />
          <span>{vehicle.vehiclePlateNumber}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Brand",
      accessorKey: "vehicleBrand",
      sortable: true,
    },
    {
      header: "Model",
      accessorKey: "vehicleModel",
    },
    {
      header: "Type",
      accessorKey: "vehicleType",
    },
    {
      header: "Color",
      accessorKey: "vehicleColor",
      cell: (vehicle) => (
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: vehicle.vehicleColor.toLowerCase() }}
          />
          <span>{vehicle.vehicleColor}</span>
        </div>
      ),
    },
    {
      header: "Year",
      accessorKey: "vehicleYear",
      sortable: true,
    },
    {
      header: "Actions",
      // Fix: Change the accessor to be a string key
      accessorKey: "id",
      cell: (vehicle) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSelectedId(vehicle.id);
              setEditModelOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => handleDeleteClick(vehicle)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Vehicles"
        description="Manage registered vehicles"
        actionLabel="Add Vehicle"
        onAction={handleCreateClick}
      />
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <CreateVehicle
            open={isCreateModalOpen}
            openChange={setIsCreateModalOpen}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={editModelOpen} onOpenChange={setEditModelOpen}>
        <DialogContent>
          <EditVehicle
            selectedId={selectedId}
            open={editModelOpen}
            openChange={setEditModelOpen}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!vehicleToDelete}
        onOpenChange={(open) => !open && setVehicleToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this vehicle? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVehicleToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
