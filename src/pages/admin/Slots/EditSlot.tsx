import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSlot, useUpdateSlot } from "@/hooks/useSlots";
import { SlotSize, SlotStatus } from "@/api/slotApi";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/CommonComponents/LoadingSpinner";

const slotFormSchema = z.object({
  slotSize: z.enum(["SMALL", "MEDIUM", "LARGE"], {
    required_error: "Please select a slot size",
  }),
  slotStatus: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE"], {
    required_error: "Please select a slot status",
  }),
});

type SlotFormValues = z.infer<typeof slotFormSchema>;

interface EditSlotModalProps {
  slotId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function EditSlotModal({ slotId, isOpen, onClose }: EditSlotModalProps) {
  const { data: slot, isLoading } = useSlot(slotId);
  const updateSlotMutation = useUpdateSlot(slotId);

  const form = useForm<SlotFormValues>({
    resolver: zodResolver(slotFormSchema),
    values: slot
      ? {
          slotSize: slot.slotSize,
          slotStatus: slot.slotStatus,
        }
      : {
          slotSize: "SMALL" as SlotSize,
          slotStatus: "AVAILABLE" as SlotStatus,
        },
  });

  const onSubmit = async (data: SlotFormValues) => {
    try {
      await updateSlotMutation.mutateAsync(data);
      onClose();
    } catch (error) {
      console.error("Failed to update slot:", error);
    }
  };

  const content = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-40">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading slot data...</p>
        </div>
      );
    }

    if (!slot) {
      return (
        <div className="flex flex-col items-center justify-center h-40">
          <p className="text-lg font-medium">Slot not found</p>
          <Button className="mt-4" onClick={onClose}>
            Close
          </Button>
        </div>
      );
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="slotSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slot Size</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={updateSlotMutation.isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a slot size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SMALL">Small</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LARGE">Large</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The size of the parking slot determines which vehicles can
                  park in it.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slotStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slot Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={updateSlotMutation.isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a slot status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="OCCUPIED">Occupied</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The current status of the parking slot.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateSlotMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateSlotMutation.isPending}>
              {updateSlotMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Parking Slot</DialogTitle>
          <DialogDescription>
            Update details for slot ID: {slotId}
          </DialogDescription>
        </DialogHeader>
        {content()}
      </DialogContent>
    </Dialog>
  );
}
