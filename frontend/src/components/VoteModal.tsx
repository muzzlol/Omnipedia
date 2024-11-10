import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

interface User {
  _id: string;
  username: string;
  avatarUrl: string;
}

interface VoteModalProps {
  triggerText: string;
  title: string;
  users: User[];
  fetchUsers: () => void;
}

const VoteModal: React.FC<VoteModalProps> = ({ triggerText, title, users, fetchUsers }) => {
  const descriptionId = `${title.toLowerCase()}-description`;

  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button
          className="p-2 cursor-pointer"
          variant="link"
          size="sm"
          onClick={fetchUsers}
        >
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-describedby={descriptionId}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {triggerText}
          </p>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {users.length > 0 ? (
            users.map(user => (
              <React.Fragment key={user._id}>
                <div className="flex items-center gap-3 py-2">
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                    <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold">{user.username}</span>
                </div>
                <Separator className="my-2" />
              </React.Fragment>
            ))
          ) : (
            <p>No users found.</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default VoteModal;
