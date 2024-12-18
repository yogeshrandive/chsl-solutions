'use client';

import { Society } from './definations';
import { formatDate, formatDateRange } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Search, Settings, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/status-badge';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';

export default function SocietiesClientPage({
  societies,
  filter,
}: {
  societies: Society[];
  filter: string | undefined;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(filter);
    if (term) {
      params.set('filter', term);
    } else {
      params.delete('filter');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleCreateClick = () => {
    setIsNavigating(true);
  };

  const CreateButton = () => (
    <Button size="lg" asChild disabled={isNavigating}>
      <Link href="/society/create" onClick={handleCreateClick}>
        {isNavigating ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <PlusCircle className="mr-2 h-5 w-5" />
        )}
        {isNavigating ? 'Redirecting...' : 'Create New Society'}
      </Link>
    </Button>
  );

  if (societies.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-[600px]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              Welcome to Society Management
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              You haven&apos;t onboarded any societies yet. Start managing your
              first society by creating one.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pt-6">
            <CreateButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Societies</h1>
        <Button asChild disabled={isNavigating}>
          <Link href="/society/create" onClick={handleCreateClick}>
            {isNavigating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="mr-2 h-4 w-4" />
            )}
            {isNavigating ? 'Redirecting...' : 'Create New Society'}
          </Link>
        </Button>
      </div>
      <div className="mb-4 relative">
        <Input
          type="text"
          placeholder="Search by name or code"
          className="pl-10"
          defaultValue={filter}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Bill Type</TableHead>
              <TableHead>Current Bill Period</TableHead>
              <TableHead>Next Bill Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {societies.map((society, index) => (
              <TableRow key={society.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{society.code}</TableCell>
                <TableCell>{society.name}</TableCell>
                <TableCell className="capitalize">
                  {society.bill_frequency}
                </TableCell>
                <TableCell>
                  {formatDateRange(
                    society.cur_period_from,
                    society.cur_period_to
                  )}
                </TableCell>
                <TableCell>
                  {society.next_bill_date
                    ? formatDate(society.next_bill_date)
                    : '-'}
                </TableCell>
                <TableCell>
                  {/* <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(society.status)}`}
                  >
                    {society.status}
                  </span> */}
                  <StatusBadge status={society.status}></StatusBadge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={
                          society.status.toLowerCase() === 'active'
                            ? `/${society.code}/dashboard`
                            : `/${society.code}/info/step${society.step}`
                        }
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
