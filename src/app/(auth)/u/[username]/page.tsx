"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { messageSchema } from "@/schemas/messageSchema";
import { useState } from "react";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const SendMessage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(false);

  const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";

  const [questions, setQuestions] = useState<string>(initialMessageString);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        ...data,
      });
      toast({
        title: response.data.message,
        variant: "default",
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to sent message",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    setLoadingQuestions(true);

    try {
      const response = await axios.post("/api/suggest-messages");
      console.log("Fetched questions:", response);
      setQuestions(response.data.content[0].text); // Update questions with API response
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      setQuestions("An error occurred while generating questions.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleMessageClick = (message: string) => {
    form.reset({ ...form.getValues(), content: message });
  };

  return (
    <div className="mx-auto px-5 sm:px-10 md:px-20 bg-black min-h-screen py-20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">
                  Send a message anonymously to @{username}
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="text-white input input-bordered"
                    placeholder="Type your message here."
                    {...field}
                  />
                </FormControl>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-white text-black hover:bg-gray-900 hover:text-white mt-4"
                >
                  {loading ? "Sending..." : "Send"}
                </Button>

                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchQuestions}
            className="my-4 bg-white text-black hover:bg-gray-900 hover:text-white"
            disabled={loadingQuestions}
          >
            {loadingQuestions ? "Generating..." : "Suggest Messages by AI"}
          </Button>
          <p className="text-white">Click on any message below to select it.</p>
        </div>
        <Card className="bg-black border-[#292929]">
          <CardHeader>
            <h3 className="text-xl font-semibold text-white">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4 bg-black">
            {typeof questions === "string" &&
              questions.split("||").map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2 text-white bg-black text-wrap sm:py-5 border-[#292929]"
                  onClick={() => handleMessageClick(question)}
                >
                  {question}
                </Button>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default SendMessage;
