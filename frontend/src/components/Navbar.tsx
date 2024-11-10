import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "./ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "./ui/separator";

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky flex items-center justify-between p-4 border-b bg-main z-50 before:content-[''] before:absolute before:bg-main before:w-full before:h-[100vh] before:-top-[100vh] before:left-0">
      <Link to="/" className="text-xl font-bold">
        Omnipedia.
      </Link>
      <nav className="hidden md:flex space-x-4">
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="text-primary hover:text-primary/80">
              Profile
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <Link to="/" onClick={logout} className="text-primary hover:text-primary/80">
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="text-primary hover:text-primary/80">
              Login
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <Link to="/register" className="text-primary hover:text-primary/80">
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
            {isAuthenticated ? (
              <>
                <SheetClose asChild>
                  <Link to="/profile" className="text-primary hover:text-primary/80 text-center">
                    Profile
                  </Link>
                </SheetClose>
                <Separator orientation="horizontal" className="w-full" />
                <SheetClose asChild>
                  <Button variant="reverse" onClick={logout} className="text-primary hover:text-primary/80 bg-red-600 hover:bg-red-500">
                    Logout
                  </Button>
                </SheetClose>
              </>
            ) : (
              <>
                <SheetClose asChild>
                  <Link to="/login" className="text-primary hover:text-primary/80 text-center">
                    Login
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/register" className="text-primary hover:text-primary/80 text-center">
                    Register
                  </Link>
                </SheetClose>
              </>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
};