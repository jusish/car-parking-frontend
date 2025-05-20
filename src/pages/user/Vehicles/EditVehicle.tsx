
import {useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from '@/components/CommonComponents/PageHeader';
import { useVehicle, useUpdateVehicle } from '@/hooks/useVehicles';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/CommonComponents/LoadingSpinner';
import { useForm } from 'react-hook-form';


const currentYear = new Date().getFullYear();

const vehicleFormSchema = z.object({
  vehiclePlateNumber: z.string().min(2, { message: 'Plate number is required' }),
  vehicleType: z.string().min(2, { message: 'Vehicle type is required' }),
  vehicleColor: z.string().min(2, { message: 'Vehicle color is required' }),
  vehicleBrand: z.string().min(2, { message: 'Vehicle brand is required' }),
  vehicleModel: z.string().min(1, { message: 'Vehicle model is required' }),
  vehicleYear: z.coerce.number()
    .min(1900, { message: 'Year must be 1900 or later' })
    .max(currentYear + 1, { message: `Year cannot be later than ${currentYear + 1}` }),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

export function EditVehicle({ open, openChange, selectedId }: { open: boolean, openChange: (open: boolean) => void, selectedId: string }) {
  const id=selectedId
  const navigate = useNavigate();
  
  const { data: vehicle, isLoading } = useVehicle(id || '');
  const updateVehicleMutation = useUpdateVehicle(id || '');

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    values: vehicle ? {
      vehiclePlateNumber: vehicle.data.vehiclePlateNumber,
      vehicleType: vehicle.data.vehicleType,
      vehicleColor: vehicle.data.vehicleColor,
      vehicleBrand: vehicle.data.vehicleBrand,
      vehicleModel: vehicle.data.vehicleModel,
      vehicleYear: vehicle.data.vehicleYear,
    } : {
      vehiclePlateNumber: '',
      vehicleType: '',
      vehicleColor: '',
      vehicleBrand: '',
      vehicleModel: '',
      vehicleYear: currentYear,
    },
  });

  const onSubmit = async (data: VehicleFormValues) => {
    try {
      await updateVehicleMutation.mutateAsync(data);
      openChange(false)
    } catch (error) {
      console.error('Failed to update vehicle:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading vehicle data...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg font-medium">Vehicle not found</p>
        <Button className="mt-4" onClick={() => navigate('/dashboard/vehicles')}>
          Back to Vehicles
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Edit Vehicle" description={`Update details for ${vehicle.data.vehicleBrand} ${vehicle.data.vehicleModel}`} />

      <Card className="border-none max-h-[400px] shadow-none overflow-auto mx-auto">
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
                        disabled={updateVehicleMutation.isPending}
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
                          disabled={updateVehicleMutation.isPending}
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
                          disabled={updateVehicleMutation.isPending}
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
                          disabled={updateVehicleMutation.isPending}
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
                          disabled={updateVehicleMutation.isPending}
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
                          disabled={updateVehicleMutation.isPending}
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
                  disabled={updateVehicleMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateVehicleMutation.isPending}>
                  {updateVehicleMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
