'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Bell,
  LogOut,
  Settings,
  User,
  Users2,
  ClipboardList,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSociety } from '@/contexts/society-context';

export function HeaderContent() {
  const { societyData: society } = useSociety();

  return (
    <header className="flex h-16 items-center justify-between border-b px-6 bg-background">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        {society ? (
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">
                  {society.name}
                </h1>
                <div
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    society.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : society.status === 'pending'
                        ? 'bg-yellow-50 text-yellow-700'
                        : society.status === 'inactive'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-gray-50 text-gray-700'
                  }`}
                >
                  {society.status === 'active'
                    ? 'Active'
                    : society.status === 'pending'
                      ? 'Pending'
                      : society.status === 'inactive'
                        ? 'Inactive'
                        : society.status}
                </div>
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <code className="rounded bg-muted px-1.5 py-0.5 font-medium">
                    {society.code}
                  </code>
                </div>
                <div className="flex items-center gap-1">
                  <Users2 className="h-4 w-4" />
                  <span>{society.total_members || '0'} members</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{society.location || 'Mumbai, IN'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ClipboardList className="h-4 w-4" />
                  <span>Est. {society.reg_no || ''}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-lg font-semibold">Society Management</div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-500">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => (window.location.href = '/signout')}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
