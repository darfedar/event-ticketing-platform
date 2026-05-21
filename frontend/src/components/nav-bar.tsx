import { useAuth } from "react-oidc-context";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useRoles } from "@/hooks/use-roles";
import { Link } from "react-router";

const NavBar: React.FC = () => {
  const { user, isAuthenticated, signinRedirect, signoutRedirect } = useAuth();
  const { isOrganizer } = useRoles();

  return (
    <div className="bg-gray-950 border-b border-gray-800 text-white">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-10 md:gap-20 items-center">
            <h1 className="text-xl font-bold tracking-tight text-white">Event Ticket Platform</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <Link className="transition hover:text-white" to="/">
                Home
              </Link>
              {isAuthenticated && (
                <Link className="transition hover:text-white" to="/">
                  Dashboard
                </Link>
              )}
              {isOrganizer && (
                <Link className="transition hover:text-white" to="/dashboard/events">
                  Events
                </Link>
              )}
              {isAuthenticated && (
                <Link className="transition hover:text-white" to="/dashboard/tickets">
                  Tickets
                </Link>
              )}
            </div>
          </div>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-700">
                    {user?.profile?.preferred_username
                      ?.slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 bg-slate-950 border border-white/10 text-white"
                align="end"
              >
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-medium">
                    {user?.profile?.preferred_username}
                  </p>
                  <p className="text-sm text-slate-400">{user?.profile?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="hover:bg-white/5"
                  onClick={() => signoutRedirect()}
                >
                  <LogOut />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="border border-white/10 bg-white/5 text-white hover:bg-white/10"
              onClick={() => signinRedirect()}
            >
              Log in
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
