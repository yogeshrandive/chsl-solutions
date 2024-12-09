import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'outline';
      case 'pending':
        return 'warning';
      case 'inactive':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Badge className={getStatusColor(status)} variant="outline">
      {status}
    </Badge>
  );
}
