'use client'
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
// import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const VerifyAccount = () => {
  const params = useParams<{ username: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>("/api/verify-code", {
        username: params.username,
        code: data.verifyCode,
      });
      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
        router.replace("/sign-in");
      }
    } catch (error) {
      console.log("Error is signing up", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Signin failed",
        description: axiosError.response?.data.message ?? "Error signing in",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl mb-5 text-gray-100">
            Verify Account
          </h1>
          <p className="mb-3 text-gray-200">
            Enter the verification code sent to your email
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="verifyCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Verification code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full bg-gray-100 text-gray-950 hover:bg-gray-200 hover:shadow-white">
              Submit
            </Button>
          </form>
        </Form>
        {/* <div className="mt-4">
          <p>
            Don&apos;t have an account? <Link href="/sign-up" className="text-gray-400">Sign Up</Link>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default VerifyAccount;
