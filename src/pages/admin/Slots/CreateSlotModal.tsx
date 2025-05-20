import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateSlot } from "@/hooks/useSlots";
import { useParkings } from "@/hooks/useParking";
import { ParkingSlotSize } from "@/api/slotApi";
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

const slotFormSchema = z.object({
  slotSize: z.enum(["SMALL", "MEDIUM", "LARGE"], {
    required_error: "Please select a slot size",
  }),
  parkingId: z.string({
    required_error: "Please select a parking location",
  }),
});

type SlotFormValues = z.infer<typeof slotFormSchema>;

interface CreateSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateSlotModal({ isOpen, onClose }: CreateSlotModalProps) {
  const createSlotMutation = useCreateSlot();
  const { data: parkingsData, isLoading: isParkingsLoading } = useParkings();

  const form = useForm<SlotFormValues>({
    resolver: zodResolver(slotFormSchema),
    defaultValues: {
      slotSize: undefined,
      parkingId: undefined,
    },
  });

  const onSubmit = async (data: SlotFormValues) => {
    try {
      await createSlotMutation.mutateAsync({
        slotSize: data.slotSize,
        parkingId: data.parkingId,
      });
      form.reset();
      onClose();
    } catch (error) {
      console.error("Failed to create slot:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Parking Slot</DialogTitle>
          <DialogDescription>
            Add a new parking slot to the system
          </DialogDescription>
        </DialogHeader>
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
                    disabled={createSlotMutation.isPending}
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
                    Select the appropriate size for the parking slot.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parkingId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parking Location</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={createSlotMutation.isPending || isParkingsLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a parking location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isParkingsLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : parkingsData?.data?.length ? (
                        parkingsData.data.map((parking) => (
                          <SelectItem key={parking.id} value={parking.id}>
                            {parking.id}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          No parking locations available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the parking location for this slot.
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
                disabled={createSlotMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createSlotMutation.isPending || isParkingsLoading}
              >
                {createSlotMutation.isPending ? "Creating..." : "Create Slot"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}