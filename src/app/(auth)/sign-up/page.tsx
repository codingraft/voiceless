"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Page = () => {
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const debunced = useDebounceCallback(setUsername, 500);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmiting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
      }
      // router.replace(`/verify/${username}`);
      router.replace(`/dashboard`);
      setIsSubmiting(false);
    } catch (error) {
      console.log("Error is signing up", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ?? "Error signing up";
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmiting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl mb-5 text-gray-100">
            Join Voiceless
          </h1>
          <p className="mb-3 text-gray-200">
            Begin your journey with Voiceless—speak anonymously, be heard
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debunced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  <p
                    className={`text-sm ${
                      usernameMessage === "Username is unique"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmiting}
              className="bg-gray-100 text-gray-950 w-full"
            >
              {isSubmiting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Please Wait
                </>
              ) : (
                "Signup"
              )}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center">
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-gray-400">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Page;
