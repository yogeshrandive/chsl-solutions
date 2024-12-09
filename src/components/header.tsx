import { Bell, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-4 lg:px-6">
      <div className="flex flex-1 items-center gap-4">
        <Input
          type="search"
          placeholder="Search for results..."
          className="md:w-[300px]"
        />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500">
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">Cart</span>
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500">
          <User className="h-5 w-5" />
          <span className="sr-only">User</span>
        </Button>
      </div>
    </header>
  );
}
