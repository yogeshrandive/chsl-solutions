"use client";

import { Society } from "./definations";
import { formatDate, formatDateRange } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, PlusCircle, Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/status-badge";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

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
  const [managingId, setManagingId] = useState<number | null>(null);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(filter);
    if (term) {
      params.set("filter", term);
    } else {
      params.delete("filter");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleCreateClick = () => {
    setIsNavigating(true);
  };

  const handleManageClick = (societyId: number) => {
    setManagingId(societyId);
  };

  const CreateButton = () => (
    <Button size="lg" asChild disabled={isNavigating}>
      <Link href="/society/create" onClick={handleCreateClick}>
        {isNavigating
          ? <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          : <PlusCircle className="mr-2 h-5 w-5" />}
        {isNavigating ? "Redirecting..." : "Create New Society"}
      </Link>
    </Button>
  );

  if (societies.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
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
    <div className="">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ">
          <h1 className="text-2xl font-bold tracking-tight">
            Manage Societies
          </h1>
          <Button asChild disabled={isNavigating}>
            <Link href="/society/create" onClick={handleCreateClick}>
              {isNavigating
                ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                : <PlusCircle className="mr-2 h-4 w-4" />}
              {isNavigating ? "Redirecting..." : "Create New Society"}
            </Link>
          </Button>
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            type="text"
            placeholder="Search by name or code"
            className="pl-10"
            defaultValue={filter}
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
          />
        </div>

        <Card className="overflow-hidden border-0 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[80px]">No.</TableHead>
                <TableHead className="w-[120px]">Code</TableHead>
                <TableHead>Society Name</TableHead>
                <TableHead>Bill Type</TableHead>
                <TableHead>Current Bill Period</TableHead>
                <TableHead>Next Bill Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {societies.map((society, index) => (
                <TableRow key={society.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {society.code}
                  </TableCell>
                  <TableCell>{society.name}</TableCell>
                  <TableCell className="capitalize">
                    {society.bill_frequency}
                  </TableCell>
                  <TableCell>
                    {formatDateRange(
                      society.cur_period_from,
                      society.cur_period_to,
                    )}
                  </TableCell>
                  <TableCell>
                    {society.next_bill_date
                      ? formatDate(society.next_bill_date)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={society.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      disabled={managingId === society.id}
                    >
                      <Link
                        href={society.status.toLowerCase() === "active"
                          ? `/${society.code}/dashboard`
                          : `/${society.code}/info/step${society.step}`}
                        onClick={() => handleManageClick(society.id)}
                      >
                        {managingId === society.id
                          ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Loading...
                            </>
                          )
                          : (
                            <>
                              <Settings className="h-4 w-4 mr-2" />
                              Manage
                            </>
                          )}
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
