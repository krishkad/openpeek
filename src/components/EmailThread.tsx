"use client";


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, Eye, EyeOff, MoreVertical, Reply } from "lucide-react";
import { useState } from "react";

interface ThreadMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  isFromUser: boolean;
  trackingEnabled: boolean;
  isOpened: boolean;
  openedTimestamp?: string;
}

interface EmailThreadProps {
  onBack: () => void;
}

const EmailThread = ({ onBack }: EmailThreadProps) => {
  const [thread] = useState<ThreadMessage[]>([
    {
      id: "1",
      from: "you@company.com",
      to: "sarah.johnson@company.com",
      subject: "Q4 Business Proposal",
      body: "Hi Sarah,\n\nI hope this email finds you well. I wanted to follow up on our previous discussion about the Q4 business proposal.\n\nAttached you'll find the detailed proposal document that outlines our strategy for the upcoming quarter. I believe this presents a great opportunity for collaboration between our teams.\n\nI'd love to schedule a call this week to discuss the details further. Please let me know what works best for your schedule.\n\nBest regards,\nAlex",
      timestamp: "2024-01-15T10:30:00Z",
      isFromUser: true,
      trackingEnabled: true,
      isOpened: true,
      openedTimestamp: "2024-01-15T11:45:00Z"
    },
    {
      id: "2",
      from: "sarah.johnson@company.com",
      to: "you@company.com",
      subject: "Re: Q4 Business Proposal",
      body: "Hi Alex,\n\nThank you for sending over the proposal. I had a chance to review it and I'm impressed with the comprehensive approach you've outlined.\n\nI think there are definitely some areas where we can collaborate effectively. I'm particularly interested in the market expansion strategy mentioned in section 3.\n\nI'm available for a call this Thursday afternoon or Friday morning. Would either of those work for you?\n\nLooking forward to discussing this further.\n\nBest,\nSarah",
      timestamp: "2024-01-15T15:22:00Z",
      isFromUser: false,
      trackingEnabled: false,
      isOpened: false
    },
    {
      id: "3",
      from: "you@company.com",
      to: "sarah.johnson@company.com",
      subject: "Re: Q4 Business Proposal",
      body: "Hi Sarah,\n\nGreat to hear you're interested! Thursday afternoon works perfectly for me.\n\nHow about we schedule a call for 2:00 PM EST? I'll send a calendar invite with the Zoom link.\n\nI'm excited to dive deeper into the market expansion strategy and explore how we can leverage both our teams' strengths.\n\nTalk to you Thursday!\n\nAlex",
      timestamp: "2024-01-15T16:10:00Z",
      isFromUser: true,
      trackingEnabled: true,
      isOpened: false
    }
  ]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
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
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">3 messages</Badge>
            <Badge variant="secondary" className="bg-success text-success-foreground">
              1 opened
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Thread Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">{thread[0].subject}</CardTitle>
            <p className="text-muted-foreground">
              Conversation with {thread.find(m => !m.isFromUser)?.from || "Unknown"}
            </p>
          </CardHeader>
        </Card>

        {/* Messages */}
        <div className="space-y-4">
          {thread.map((message, index) => (
            <Card key={message.id} className={`${message.isFromUser ? 'ml-8' : 'mr-8'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      message.isFromUser 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {message.from.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {message.isFromUser ? 'You' : message.from}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        to {message.isFromUser ? message.to : 'you'} • {formatDate(message.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Tracking Status for User Messages */}
                    {message.isFromUser && message.trackingEnabled && (
                      <div className="flex items-center space-x-2">
                        {message.isOpened ? (
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4 text-green-600" />
                            <Badge variant="default" className="bg-green-600 text-success-foreground text-xs">
                              Opened
                            </Badge>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <EyeOff className="h-4 w-4 text-unopened" />
                            <Badge variant="secondary" className="bg-unopened text-unopened-foreground text-xs">
                              Not Opened
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="whitespace-pre-line text-foreground leading-relaxed">
                  {message.body}
                </div>
                
                {/* Tracking Details */}
                {message.isFromUser && message.trackingEnabled && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Email tracking enabled</span>
                      </div>
                      {message.isOpened && message.openedTimestamp && (
                        <div className="flex items-center space-x-1 text-success">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">
                            Opened {formatRelativeTime(message.openedTimestamp)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reply Button */}
        <div className="mt-6 flex justify-center">
          <Button className="bg-primary hover:bg-primary-hover">
            <Reply className="h-4 w-4 mr-2" />
            Reply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailThread;