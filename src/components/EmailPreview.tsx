import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Email } from "./Dashboard";

interface EmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: Email | undefined;
}

export default function EmailPreview({
  open,
  onOpenChange,
  email,
}: EmailModalProps) {
  if (!email) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl p-6 max-h-[88vh] overflow-y-scroll"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-start justify-between gap-4 text-lg font-semibold">
            <div className="flex-1">{email.subject}</div>
            <Badge variant={email.isOpen ? "default" : "secondary"}>
              {email.isOpen ? "Opened" : "Not Opened"}
            </Badge>
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Sent on {format(email.createdAt, "PPPpp")}
            {email.isOpen && (
              <span className="text-green-600">
                <br />
                Opened on {format(email.updatedAt ?? email.updatedAt, "PPPpp")}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-1 text-sm text-muted-foreground border-b pb-4">
          <div>
            <span className="font-medium text-gray-800">From:</span>{" "}
            {email.fromEmail}
          </div>
          <div>
            <span className="font-medium text-gray-800">To:</span>{" "}
            {email.toEmail}
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-900">
          <div
            className="prose prose-sm max-w-none space-y-2"
            dangerouslySetInnerHTML={{ __html: email.body }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
