import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/CommonComponents/PageHeader";
import { useCreateManySlots } from "@/hooks/useSlots";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const bulkSlotFormSchema = z.object({
  numberOfSlots: z
    .string()
    .min(1, { message: "Number of slots is required" })
    .refine((value) => !isNaN(Number(value)), { message: "Must be a number" })
    .refine((value) => Number(value) > 0, { message: "Must be greater than 0" })
    .refine((value) => Number(value) <= 100, {
      message: "Cannot create more than 100 slots at once",
    }),
  slotSize: z.enum(["SMALL", "MEDIUM", "LARGE"], {
    required_error: "Please select a slot size",
  }),
});

type BulkSlotFormValues = z.infer<typeof bulkSlotFormSchema>;

export function BulkCreateSlots({
  open,
  openChange,
}: {
  open: boolean;
  openChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const createManySlotssMutation = useCreateManySlots();

  const form = useForm<BulkSlotFormValues>({
    resolver: zodResolver(bulkSlotFormSchema),
    defaultValues: {
      numberOfSlots: "",
      slotSize: undefined,
    },
  });

  const onSubmit = async (data: BulkSlotFormValues) => {
    try {
      await createManySlotssMutation.mutateAsync({
        numberOfSlots: Number(data.numberOfSlots),
        slotSize: data.slotSize,
      });
      openChange(false);
    } catch (error) {
      console.error("Failed to create slots:", error);
    }
  };

  return (
    <>
      <Card className="w-full border-none mx-auto">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="numberOfSlots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Slots</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter number of slots"
                        min="1"
                        max="100"
                        disabled={createManySlotssMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      How many slots do you want to create? Maximum is 100.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slotSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slot Size</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={createManySlotssMutation.isPending}
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
                      All created slots will have this size.
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
                  disabled={createManySlotssMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createManySlotssMutation.isPending}
                >
                  {createManySlotssMutation.isPending
                    ? "Creating..."
                    : "Create Slots"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
