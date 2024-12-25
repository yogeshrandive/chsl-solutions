import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";

const dashboardData = [
    {
        title: "Total Revenue",
        value: "$45,231.89",
        change: "+20.1% from last month",
        icon: DollarSign,
    },
    {
        title: "Active Members",
        value: "2,350",
        change: "+180.1% from last month",
        icon: Users,
    },
    {
        title: "Pending Payments",
        value: "12",
        change: "-19% from last month",
        icon: CreditCard,
    },
    {
        title: "Active Events",
        value: "7",
        change: "+201 since last hour",
        icon: Activity,
    },
];

export function DashboardCards() {
    return (
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
                        <p className="text-xs text-muted-foreground">
                            {item.change}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
