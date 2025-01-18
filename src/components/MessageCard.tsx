import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  // CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Message } from "@/model/User.model";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import dayjs from "dayjs";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({message, onMessageDelete}: MessageCardProps) => {
    const {toast} = useToast()
    const handleDelete = async () => {
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        if (response.data.success) {
            toast({
                title: "Message deleted",
                description: response.data.message,
            })
        }
        onMessageDelete(message._id as string);
    }
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
        <CardTitle className="text-xl">{message.content}</CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-5 h-5"><X /></Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>
      </CardHeader>
      <CardContent> <p className="text-xs"> {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}</p></CardContent>
    </Card>
  );
};
export default MessageCard;
