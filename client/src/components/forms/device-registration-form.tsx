import { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { deviceTypes } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface DeviceRegistrationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  userId: z.number(),
  type: z.enum(deviceTypes),
  name: z.string().min(1, "Device name is required"),
  imei: z.string()
    .min(15, "IMEI must be at least 15 characters")
    .max(17, "IMEI must not exceed 17 characters")
    .regex(/^[0-9]+$/, "IMEI must contain only numbers"),
  email: z.string().email("Please enter a valid email address"),
  notes: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export const DeviceRegistrationForm: FC<DeviceRegistrationFormProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: parseInt(localStorage.getItem("userId") || "1"),
      type: "smartphone",
      name: "",
      imei: "",
      email: "",
      notes: "",
      termsAccepted: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Extract termsAccepted from the values since it's not part of the device schema
      const { termsAccepted, ...deviceData } = values;
      
      await apiRequest("POST", "/api/devices", deviceData);
      
      // Invalidate queries to refresh device lists
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/devices-with-locations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/device-stats"] });
      
      toast({
        title: "Device Registered",
        description: "Your device has been successfully registered.",
        variant: "default",
      });
      
      // Close the modal
      onOpenChange(false);
      
      // Reset the form
      form.reset();
    } catch (error) {
      console.error("Failed to register device:", error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-gray-800 text-lg font-semibold">Register New Device</DialogTitle>
          <DialogDescription>
            Add a new device to track its location and status.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select device type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="smartphone">Smartphone</SelectItem>
                      <SelectItem value="tablet">Tablet</SelectItem>
                      <SelectItem value="laptop">Laptop</SelectItem>
                      <SelectItem value="smartwatch">Smartwatch</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., My iPhone 13" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="imei"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    IMEI Number
                    <span className="text-xs text-gray-500 ml-1">(Find in Settings {`>`} About)</span>
                  </FormLabel>
                  <FormControl>
                    <Input className="font-mono" placeholder="15 digit number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Associated Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add any additional details about this device" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            
            <DialogFooter className="sm:justify-end mt-6 gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Register Device
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
