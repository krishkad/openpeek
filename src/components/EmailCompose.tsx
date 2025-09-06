"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ArrowLeft, Eye, EyeOff, Paperclip, Send } from "lucide-react";
import ModernEmailEditor from "./TextEditor";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const EmailCompose = () => {
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [isClick, setIsClick] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [emailData, setEmailData] = useState({
    to: "",
    from: "",
    subject: "",
    body: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const editorr = useEditor({
    extensions: [StarterKit, Underline, Link.configure({ openOnClick: false })],
    content: "<div></div>",
    immediatelyRender: false,
  });

  const handleSend = async () => {
    if (
      !emailData.to ||
      !emailData.subject ||
      !emailData.from ||
      !editorr?.getHTML()
    ) {
      toast.warning("Missing Information");
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: emailData.to,
          from: emailData.from,
          subject: emailData.subject,
          email: editorr.getHTML(),
          trackEnable: trackingEnabled,
          isClick: isClick ?? false,
          redirectUrl,
        }),
      });

      const res = await response.json();

      if (!res.success) {
        toast.warning("failed to send email");
        console.log(res.message);
        return;
      }

      console.log("email sent successfully");
      toast.success("email sent successfully");
      setEmailData({ to: "", from: "", subject: "", body: "" });
      setIsClick(false);
      setRedirectUrl("");
      editorr.setOptions({ content: "<div></div>" });
    } catch (error) {
      console.log("error while sending email: ", error);
      toast.warning("failed to send email");
    } finally {
      setIsSubmitting(false);
    }

    console.log({ email: editorr?.getHTML() });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <Badge variant="secondary" className="bg-primary text-white">
            Gmail Integration
          </Badge>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Compose Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5 text-primary" />
                <span>Compose New Email</span>
              </CardTitle>

              {/* Tracking Toggle */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  {trackingEnabled ? (
                    <Eye className="h-4 w-4 text-success" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Label
                    htmlFor="tracking-toggle"
                    className="text-sm font-medium"
                  >
                    Track Email Opens
                  </Label>
                  <Switch
                    id="tracking-toggle"
                    checked={trackingEnabled}
                    onCheckedChange={setTrackingEnabled}
                  />
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Tracking Status */}
            {trackingEnabled && (
              <div className="bg-primary/10 rounded-lg p-3 border-l-4 border-l-primary">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    Email Tracking Enabled
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  You&apos;ll be notified when the recipient opens this email. A
                  small tracking pixel will be added.
                </p>
              </div>
            )}

            {/* Email Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="from" className="text-sm font-medium">
                  From
                </Label>
                <Input
                  id="from"
                  type="email"
                  placeholder="sender@example.com"
                  value={emailData.from}
                  onChange={(e) =>
                    setEmailData((prev) => ({ ...prev, from: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="to" className="text-sm font-medium">
                  To
                </Label>
                <Input
                  id="to"
                  type="email"
                  placeholder="recipient@example.com"
                  value={emailData.to}
                  onChange={(e) =>
                    setEmailData((prev) => ({ ...prev, to: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </Label>
                <Input
                  id="subject"
                  placeholder="Enter email subject"
                  value={emailData.subject}
                  onChange={(e) =>
                    setEmailData((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div className="flex items-center justify-end space-x-2">
                <div className="flex items-center space-x-2">
                  {isClick ? (
                    <Eye className="h-4 w-4 text-success" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Label
                    htmlFor="redirect-toggle"
                    className="text-sm font-medium"
                  >
                    Track Click 
                  </Label>
                  <Switch
                    id="redirect-toggle"
                    checked={isClick}
                    onCheckedChange={setIsClick}
                  />
                </div>
              </div>
              {isClick && (
                <div>
                  <Label htmlFor="redirect-url" className="text-sm font-medium">
                    Redirect Url
                  </Label>
                  <Input
                    id="redirect-url"
                    placeholder="Enter redirect url"
                    value={redirectUrl}
                    onChange={(e) => setRedirectUrl(e.target.value)}
                    className="mt-1"
                  />
                </div>
              )}
              <div>
                <Label htmlFor="body" className="text-sm font-medium">
                  Message
                </Label>
                <div className="mt-1">
                  <ModernEmailEditor editor={editorr} />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attach Files
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline">Save Draft</Button>
                <Button
                  onClick={handleSend}
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary-hover"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gmail Integration Info */}
        <Card className="mt-6 bg-primary/10">
          <CardContent className="">
            <div className="flex items-start space-x-3">
              <div className="bg-primary rounded-full p-2">
                <Eye className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  Gmail Integration Active
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This compose window simulates the Gmail interface with
                  OpenPeek tracking integration. When enabled, a small tracking
                  pixel is automatically added to your emails.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailCompose;
