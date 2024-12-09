'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';

import { menuRules } from '@/lib/menuRules';
import { MenuItem } from '@/lib/menuRules';
import { useSelectedSociety } from '@/store/selected-society';

export function MainSidebar() {
  const pathname = usePathname();
  const { society } = useSelectedSociety();
  const params = useParams();
  const societyCode = params.code as string;

  const filteredMenuRules = menuRules;
  // .filter((item) => {
  //   if (item.requiresSociety && !society) return false;
  //   return true;
  // });

  const isActive = (item: MenuItem) => {
    return item.matchPaths.some((path: string) => pathname.startsWith(path));
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">
            {society ? society.name : 'Society App'}
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {filteredMenuRules.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={cn(isActive(item) && 'bg-muted')}
              >
                <Link
                  href={'/' + societyCode + item.link}
                  className="flex items-center"
                >
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  {item.title}
                </Link>
              </SidebarMenuButton>
              {item.subItems && (
                <SidebarMenuSub>
                  {item.subItems.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        className={cn(isActive(subItem) && 'bg-muted')}
                      >
                        <Link href={'/' + societyCode + subItem.link}>
                          {subItem.title}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <p className="text-sm text-muted-foreground">
          © 2024 Society App. All rights reserved.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
