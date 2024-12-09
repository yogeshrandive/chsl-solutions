import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import AccountForm from './data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CreditCard, DollarSign, Users } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/login');
  }
  const socData = await supabase.from('societies').select('*').eq('id', 9);

  // Sample data for dashboard cards
  const dashboardData = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1% from last month',
      icon: DollarSign,
    },
    {
      title: 'Active Members',
      value: '2,350',
      change: '+180.1% from last month',
      icon: Users,
    },
    {
      title: 'Pending Payments',
      value: '12',
      change: '-19% from last month',
      icon: CreditCard,
    },
    {
      title: 'Active Events',
      value: '7',
      change: '+201 since last hour',
      icon: Activity,
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardData.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">{item.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">
              Hello {data.user.email} {data.user.user_metadata.name}
            </p>
            <AccountForm user={data.user} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Society Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Society Name: {socData.data?.[0]?.name}</p>
            {/* Add more society information here */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
