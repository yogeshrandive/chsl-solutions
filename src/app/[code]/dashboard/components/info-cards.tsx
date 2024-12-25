import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@supabase/supabase-js";
import AccountForm from "../data";
import { Tables } from "@/utils/supabase/database.types";

interface InfoCardsProps {
    user: User;
    society: Tables<"societies">;
}

export function InfoCards({ user, society }: InfoCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-2">
                        Hello {user.email} {user.user_metadata.name}
                    </p>
                    <AccountForm user={user} />
                </CardContent>
            </Card>
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Society Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Society Name: {society?.name}</p>
                    {/* Add more society information here */}
                </CardContent>
            </Card>
        </div>
    );
}
