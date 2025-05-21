import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/CommonComponents/PageHeader";
import { useCreateSlotOrder } from "@/hooks/useSlotOrders";
import { useSlot, useSlots } from "@/hooks/useSlots";
import { useUserVehicles } from "@/hooks/useVehicles";
import { Slot } from "@/api/slotApi";
import { Vehicle } from "@/api/vehicleApi";
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
import { LoadingSpinner } from "@/components/CommonComponents/LoadingSpinner";
import { SlotSizeBadge } from "@/components/CommonComponents/SlotSizeBadge";

const orderFormSchema = z.object({
  slotId: z.string({
    required_error: "Please select a parking slot",
  }),
  vehiclePlateNumber: z.string({
    required_error: "Please select a vehicle",
  }),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

export function BookSlot({
  open,
  openChange,
  selectedSlotId,
}: {
  open: boolean;
  openChange: (open: boolean) => void;
  selectedSlotId: string;
}) {
  const { mutateAsync: createOrder, isPending } = useCreateSlotOrder();
  const { data: slotData, isLoading: slotsLoading } = useSlot(selectedSlotId);
  const { data: vehiclesData, isLoading: vehiclesLoading } = useUserVehicles();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      slotId: selectedSlotId,
      vehiclePlateNumber: "",
    },
  });

  const onSubmit = async (data: OrderFormValues) => {
    try {
      await createOrder({
        slotId: data.slotId,
        vehiclePlateNumber: data.vehiclePlateNumber,
      });

      openChange(false);
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  const isLoading = slotsLoading || vehiclesLoading;

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading data...</p>
        </div>
      ) : (
        <Card className="border-none w-full shadow-none mx-auto">
          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="slotId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parking Slot</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an available parking slot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-72">
                          <SelectItem
                            key={slotData?.data?.id}
                            value={slotData?.data?.id}
                          >
                            <div className="flex items-center gap-2">
                              <span>{slotData?.data?.parkingSlotNumber}</span>
                              <SlotSizeBadge size={slotData?.data?.parkingSlotSize} />
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select an available parking slot to reserve.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehiclePlateNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a vehicle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-72">
                          {vehiclesData && vehiclesData.data.length > 0 ? (
                            vehiclesData.data.map((vehicle) => (
                              <SelectItem
                                key={vehicle.id}
                                value={vehicle.vehiclePlateNumber}
                              >
                                {vehicle.vehiclePlateNumber} -{" "}
                                {vehicle.vehicleBrand} {vehicle.vehicleModel}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-vehicles" disabled>
                              No vehicles registered
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select one of your registered vehicles.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => openChange(false)}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      isPending || !slotData?.data || !vehiclesData?.data.length
                    }
                  >
                    {isPending ? "Creating..." : "Reserve Slot"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
