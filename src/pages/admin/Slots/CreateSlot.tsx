import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/CommonComponents/PageHeader";
import { useCreateSlot } from "@/hooks/useSlots";
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
import { Card, CardContent } from "@/components/ui/card";

const slotFormSchema = z.object({
  slotSize: z.enum(["SMALL", "MEDIUM", "LARGE"], {
    required_error: "Please select a slot size",
  }),
  parkingId: z.string(),
});

type SlotFormValues = z.infer<typeof slotFormSchema>;

export function CreateSlot() {
  const navigate = useNavigate();
  const createSlotMutation = useCreateSlot();

  const form = useForm<SlotFormValues>({
    resolver: zodResolver(slotFormSchema),
    defaultValues: {
      slotSize: undefined,
      parkingId: undefined,
    },
  });

  const onSubmit = async (data: SlotFormValues) => {
    try {
      // Ensure we pass the required slotSize property
      await createSlotMutation.mutateAsync({
        slotSize: data.slotSize,
        parkingId: data.parkingId,
      });
      navigate("/dashboard/slots");
    } catch (error) {
      console.error("Failed to create slot:", error);
    }
  };

  return (
    <>
      <PageHeader
        title="Create Parking Slot"
        description="Add a new parking slot to the system"
      />

      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
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

              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/slots")}
                  disabled={createSlotMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createSlotMutation.isPending}>
                  {createSlotMutation.isPending ? "Creating..." : "Create Slot"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
