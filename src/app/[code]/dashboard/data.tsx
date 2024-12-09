import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AccountFormProps {
  user: User;
}

export default function AccountForm({ user }: AccountFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Name:</strong> {user.user_metadata.name}
          </p>
          {/* Add more user details here */}
        </div>
      </CardContent>
    </Card>
  );
}
