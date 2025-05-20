import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { usePasswordReset } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/CommonComponents/LoadingSpinner";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Valid email is required" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword() {
  const { sendResetEmail, isResetEmailLoading } = usePasswordReset();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await sendResetEmail(data.email);
      setIsSuccess(true);
    } catch (error) {
      console.error("Failed to send reset email:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="text-muted-foreground mt-2">
          Enter your email to receive a password reset link
        </p>
      </div>

      {isSuccess ? (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800">
            Password reset email sent
          </h3>
          <p className="text-green-700 mt-1">
            Check your inbox for instructions to reset your password.
          </p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@example.com"
                      type="email"
                      autoComplete="email"
                      disabled={isResetEmailLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isResetEmailLoading}
            >
              {isResetEmailLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </Form>
      )}

      <div className="text-center">
        <p className="text-sm">
          Remember your password?{" "}
          <Link to="/login" className="text-parking-primary hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
