import React from "react";
import {
  PenSquare,
  User,
  LogOut,
  LayoutDashboard,
  BookmarkIcon,
  ArrowLeft,
  Search,
  Users,
} from "lucide-react";

import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { Page } from "../index";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page | "back", id?: string) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function Layout({
  children,
  currentPage,
  onNavigate,
  isAuthenticated,
  onLogout,
}: LayoutProps) {
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const isAuthPage = currentPage === "login" || currentPage === "signup";

  return (
    <div className="min-h-screen bg-background">
      {!isAuthPage && (
        <header className="bg-card/80 border-b sticky top-0 z-50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
            {/* LEFT */}
            <div className="flex items-center gap-2">
              {currentPage !== "home" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onNavigate("back")}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}

              <button
                onClick={() => onNavigate("home")}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <PenSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold">BlogHub</span>
              </button>
            </div>

            {/* RIGHT */}
            <nav className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => onNavigate("following-feed")}
              >
                <Users className="w-4 h-4 mr-2" />
                Feed
              </Button>

              <Button
                variant="ghost"
                onClick={() => onNavigate("search-users")}
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>

              <Button
                variant="ghost"
                onClick={() => onNavigate("create")}
              >
                <PenSquare className="w-4 h-4 mr-2" />
                Write
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {currentUser?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="font-medium">{currentUser?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {currentUser?.email}
                    </p>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => onNavigate("profile")}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => onNavigate("dashboard")}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => onNavigate("reading-list")}>
                    <BookmarkIcon className="w-4 h-4 mr-2" />
                    Reading List
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => {
                      localStorage.clear();
                      onLogout();
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
        </header>
      )}

      <main>{children}</main>
    </div>
  );
}
