"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Eye, Mail, Shield } from "lucide-react";
import { useRouter } from "next/navigation";



const LoginPage = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-secondary flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-primary rounded-lg p-2">
              <Eye className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">OpenPeek</h1>
          </div>
          <p className="text-muted-foreground">Track when your emails are opened</p>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Connect Your Gmail</CardTitle>
            <CardDescription>
              Securely connect your Gmail account to start tracking email opens
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Features List */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="text-sm text-foreground">Real-time email open tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="text-sm text-foreground">Visual status indicators</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="text-sm text-foreground">Detailed tracking dashboard</span>
              </div>
            </div>

            {/* Permissions Info */}
            <div className="bg-primary/10 rounded-lg p-4 space-y-2">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Required Permissions</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 ml-6">
                <li>• Read and send emails via Gmail</li>
                <li>• Access to compose and sent items</li>
                <li>• Add tracking pixels to outgoing emails</li>
              </ul>
            </div>

            {/* Login Button */}
            <Button 
              onClick={() => router.push("/dashboard")}
              className="w-full bg-primary hover:bg-primary-hover"
              size="lg"
            >
              <Mail className="h-4 w-4 mr-2" />
              Connect with Gmail
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              We use OAuth 2.0 for secure authentication. Your data is encrypted and never stored.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;