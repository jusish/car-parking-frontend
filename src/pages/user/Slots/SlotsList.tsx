
import { useState } from 'react';
import { PageHeader } from '@/components/CommonComponents/PageHeader';
import { useSlots } from '@/hooks/useSlots';
import { DataTable, Column } from '@/components/DataTable/DataTable';
import { Slot } from '@/api/slotApi';
import { SlotSizeBadge } from '@/components/CommonComponents/SlotSizeBadge';
import { StatusBadge } from '@/components/CommonComponents/StatusBadge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@/components/ui/dialog';
import { DialogContent } from '@/components/ui/dialog';
import { BookSlot } from './BookSlot';



export function UserSlotsList() {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  
  const { data, isLoading } = useSlots({
    page: pageIndex + 1,
    limit: pageSize,
    search,
    slotStatus: 'AVAILABLE', 
  });

  const columns: Column<Slot>[] = [
    {
      header: 'Number',
      accessorKey: 'data',
      cell: (slot) => <span>{slot.parkingSlotNumber}</span>,
    },
    {
      header: 'Size',
      accessorKey: 'data',
      cell: (slot) => <SlotSizeBadge size={slot.parkingSlotSize} />,
      sortable: true,
    },
    {
      header: 'Status',
      accessorKey: 'data',
      cell: (slot) => <StatusBadge status={slot.parkingSlotStatus} />,
      sortable: true,
    },
    {
      header: 'Actions',
      accessorKey: 'data',
      cell: (slot) => (
        <Button size="sm" onClick={() => {
          setSelectedSlotId(slot.id);
          setOpen(true);
        }}>
          Book Now
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader 
        title="Available Parking Slots" 
        description="Find and book parking slots"
      />
      <Dialog open={open} onOpenChange={setOpen}> 
        <DialogContent> 
          <BookSlot open={open} openChange={setOpen} selectedSlotId={selectedSlotId}/>
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
