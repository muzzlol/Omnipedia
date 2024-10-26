import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <Link to="/" className="text-xl font-bold">
        Omnipedia.
      </Link>
      <nav className="hidden md:flex space-x-4">
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="text-gray-600 hover:text-gray-900">
              Profile
            </Link>
            <Button onClick={logout} variant="ghost">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link to="/register" className="text-gray-600 hover:text-gray-900">
              Register
            </Link>
          </>
        )}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <nav className="flex flex-col space-y-4">
            <Link to="/topics" className="text-gray-600 hover:text-gray-900">
              Topics
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                  Profile
                </Link>
                <Button onClick={logout} variant="ghost">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link to="/register" className="text-gray-600 hover:text-gray-900">
                  Register
                </Link>
              </>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
};