"use client";


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Filter, Mail, Search } from "lucide-react";
import { useEffect, useState } from "react";

interface Email {
  _id: string;
  userId: string;
  subject: string;
  toEmail: string;
  fromEmail: string;
  isOpen: boolean;
  openCount?: number;
  createdAt: string;
  updatedAt: string
}

interface DashboardProps {
  onComposeEmail: () => void;
}

const Dashboard = ({ onComposeEmail }: DashboardProps) => {
  
  // Mock email data
  const [emails, setEmails] = useState<Email[]>([]);

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");



  useEffect(() => {
   const fetchEmails = async () => {
    try {
      
      const response = await fetch("/api/email/get-all", {
        method: 'GET',
        credentials: "include"
      });
      
      const res = await response.json();
      
      if(!res.success) {
        console.log("error while fetching emails: ", res.message);
        return;
      }
      
      setEmails(res.data)
    } catch (error) {
      console.log("error while fetching emails: ", error);
    }
   }
   fetchEmails();
  }, [])
  

  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.toEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || 
                         (filter === "opened" && email.isOpen) ||
                         (filter === "not-opened" && !email.isOpen);
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleEmailClick = (email: Email) => {
    if (email.isOpen) {
    //   toast({
    //     title: "Email Details",
    //     description: `Opened on ${formatDate(email.openedDate!)}`,
    //   });
    }
  };

  const openedCount = emails.filter(e => e.isOpen).length;
  const totalCount = emails.length;
  const openRate = Math.round((openedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="bg-primary rounded-lg p-2">
              <Eye className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">OpenPeek Dashboard</h1>
          </div>
          <Button onClick={onComposeEmail} className="bg-primary hover:bg-primary-hover">
            <Mail className="h-4 w-4 mr-2" />
            Compose Email
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tracked</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCount}</div>
              <p className="text-xs text-muted-foreground">emails sent with tracking</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Opened</CardTitle>
              <Eye className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{openedCount}</div>
              <p className="text-xs text-muted-foreground">emails opened by recipients</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
              <Eye className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{openRate}%</div>
              <p className="text-xs text-muted-foreground">overall open rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Email List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tracked Emails</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="opened">Opened</SelectItem>
                    <SelectItem value="not-opened">Not Opened</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredEmails.map((email) => (
                <div
                  key={email._id}
                  onClick={() => handleEmailClick(email)}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center space-x-2">
                      {email.isOpen ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-accent-foreground" />
                      )}
                      <Badge 
                        variant={email.isOpen ? "default" : "secondary"}
                        className={email.isOpen ? "bg-green-600 text-white" : "bg-gray-200 text-foreground"}
                      >
                        {email.isOpen ? "Opened" : "Not Opened"}
                      </Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{email.subject}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        To: {email.toEmail}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Sent: {formatDate(email.createdAt)}
                    </p>
                    {email.isOpen && email.updatedAt && (
                      <p className="text-sm text-green-600">
                        Opened: {formatDate(email.updatedAt)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;