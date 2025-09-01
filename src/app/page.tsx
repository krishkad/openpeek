"use client"
import { useState } from "react";
import LoginPage from "@/components/LoginPage";
import Dashboard from "@/components/Dashboard";
import EmailCompose from "@/components/EmailCompose";
import EmailThread from "@/components/EmailThread";

type AppState = "login" | "dashboard" | "compose" | "thread";

const Home = () => {
  const [currentState, setCurrentState] = useState<AppState>("login");

  const renderCurrentView = () => {
    switch (currentState) {
      case "login":
        return <LoginPage onLogin={() => setCurrentState("dashboard")} />;
      case "dashboard":
        return (
          <Dashboard 
            onComposeEmail={() => setCurrentState("compose")}
          />
        );
      case "compose":
        return (
          <EmailCompose 
            onBack={() => setCurrentState("dashboard")}
            onSend={() => setCurrentState("dashboard")}
          />
        );
      case "thread":
        return (
          <EmailThread 
            onBack={() => setCurrentState("dashboard")}
          />
        );
      default:
        return <LoginPage onLogin={() => setCurrentState("dashboard")} />;
    }
  };

  return renderCurrentView();
};

export default Home;