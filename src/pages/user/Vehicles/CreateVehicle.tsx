import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/CommonComponents/PageHeader";
import { useCreateVehicle } from "@/hooks/useVehicles";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const currentYear = new Date().getFullYear();

const vehicleFormSchema = z.object({
  vehiclePlateNumber: z
    .string()
    .min(2, { message: "Plate number is required" }),
  vehicleType: z.string().min(2, { message: "Vehicle type is required" }),
  vehicleColor: z.string().min(2, { message: "Vehicle color is required" }),
  vehicleBrand: z.string().min(2, { message: "Vehicle brand is required" }),
  vehicleModel: z.string().min(1, { message: "Vehicle model is required" }),
  vehicleYear: z.coerce
    .number()
    .min(1900, { message: "Year must be 1900 or later" })
    .max(currentYear + 1, {
      message: `Year cannot be later than ${currentYear + 1}`,
    }),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

export function CreateVehicle({
  open,
  openChange,
}: {
  open: boolean;
  openChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const createVehicleMutation = useCreateVehicle();

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      vehiclePlateNumber: "",
      vehicleType: "",
      vehicleColor: "",
      vehicleBrand: "",
      vehicleModel: "",
      vehicleYear: currentYear,
    },
  });

  const onSubmit = async (data: VehicleFormValues) => {
    try {
      // Ensure we pass all required properties with their values
      await createVehicleMutation.mutateAsync({
        vehiclePlateNumber: data.vehiclePlateNumber,
        vehicleType: data.vehicleType,
        vehicleColor: data.vehicleColor,
        vehicleBrand: data.vehicleBrand,
        vehicleModel: data.vehicleModel,
        vehicleYear: data.vehicleYear,
      });
      openChange(false);
    } catch (error) {
      console.error("Failed to create vehicle:", error);
    }
  };

  return (
    <div className="max-h-[500px] overflow-auto">
      <PageHeader
        title="Add New Vehicle"
        description="Register a new vehicle in the system"
      />

      <Card className="border-none  shadow-none mx-auto">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="vehiclePlateNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Plate Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter plate number"
                        disabled={createVehicleMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The license plate number of your vehicle.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="vehicleBrand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Toyota"
                          disabled={createVehicleMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehicleModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Corolla"
                          disabled={createVehicleMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1  gap-6">
                <FormField
                  control={form.control}
                  name="vehicleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Type</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Sedan"
                          disabled={createVehicleMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehicleColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Blue"
                          disabled={createVehicleMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehicleYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1900}
                          max={currentYear + 1}
                          disabled={createVehicleMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openChange(false)}
                  disabled={createVehicleMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createVehicleMutation.isPending}
                >
                  {createVehicleMutation.isPending
                    ? "Creating..."
                    : "Add Vehicle"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
