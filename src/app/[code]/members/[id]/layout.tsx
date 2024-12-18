import { redirect } from 'next/navigation';
import { getMember } from '@/models/members';
import { getUserDetails } from '@/lib/dal';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Mail, Phone, User, MapPin } from 'lucide-react';

export default async function MemberLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: number; code: string };
}) {
  const user = await getUserDetails();
  if (!user) {
    redirect('/login');
  }

  const { id, code } = await params;
  const member = await getMember(id);

  if (!member || member == null) {
    redirect(`/${code}/members`);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Primary Info */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{member.full_name}</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline">{member.code}</Badge>
                    <Badge
                      variant={
                        member.status === 'active' ? 'default' : 'destructive'
                      }
                    >
                      {member.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{member.mobile}</span>
              </div>
              {member.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{member.email}</span>
                </div>
              )}
              {member.assoc_mobile && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {member.assoc_name} (Associate): {member.assoc_mobile}
                  </span>
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>
                  {member.flat_no}, {member.build_name}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="capitalize">
                  {member.premise_type} - {member.premise_unit_type}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground">
                  Area: {member.area} {member.area_unit}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {children}
    </div>
  );
}
