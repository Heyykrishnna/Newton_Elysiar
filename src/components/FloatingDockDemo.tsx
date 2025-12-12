import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  Home,
  FileText,
  BookOpen,
  Award,
  Calendar,
  Users,
  User,
  Settings,
  MessageCircle,
  Brain,
  Atom,
  Library,
  SquarePen
} from "lucide-react";
import { TbDeviceDesktopCode } from "react-icons/tb";

export default function FloatingDockDemo() {
  const links = [
    {
      title: "Home",
      icon: (
        <Home className="h-full w-full text-white dark:text-white" />
      ),
      href: "/",
    },
    // {
    //   title: "Tests",
    //   icon: (
    //     <FileText className="h-full w-full text-white dark:text-white" />
    //   ),
    //   href: "/tests",
    // },
    {
      title: "Resources",
      icon: (
        <Library className="h-full w-full text-white dark:text-white" />
      ),
      href: "/study-resources",
    },
    {
      title: "AI Learning Hub",
      icon: (
        <Atom className="h-full w-full text-white dark:text-white" />
      ),
      href: "/ai-learning",
    },
    {
      title: "Coding Practice",
      icon: (
        <TbDeviceDesktopCode className="h-full w-full text-white dark:text-white" />
      ),
      href: "/coding-practice",
    },
    // {
    //   title: "Results",
    //   icon: (
    //     <Award className="h-full w-full text-white dark:text-white" />
    //   ),
    //   href: "/results",
    // },
    {
      title: "Calendar",
      icon: (
        <Calendar className="h-full w-full text-white dark:text-white" />
      ),
      href: "/modern-calendar",
    },
    // {
    //   title: "Attendance",
    //   icon: (
    //     <SquarePen className="h-full w-full text-white dark:text-white" />
    //   ),
    //   href: "/attendance",
    // },
    {
      title: "Support",
      icon: (
        <MessageCircle className="h-full w-full text-white dark:text-white" />
      ),
      href: "/support",
    },
    {
      title: "Users Settings",
      icon: (
        <User className="h-full w-full text-white dark:text-white" />
      ),
      href: "/settings",
    },
    // {
    //   title: "Our Team",
    //   icon: (
    //     <Users className="h-full w-full text-white dark:text-white" />
    //   ),
    //   href: "/teams",
    // },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <FloatingDock items={links} />
    </div>
  );
}