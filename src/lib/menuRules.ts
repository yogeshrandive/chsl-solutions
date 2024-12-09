import { LucideIcon, Home, FileText, Users } from 'lucide-react';

export interface MenuItem {
  title: string;
  link: string;
  icon?: LucideIcon;
  matchPaths: string[];
  subItems?: MenuItem[];
  roles?: string[];
  pageTitle?: string;
  requiresSociety?: boolean;
}

export const menuRules: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: Home,
    link: '/dashboard',
    matchPaths: ['/'],
    roles: ['admin', 'employee'],
    pageTitle: 'Dashboard',
    requiresSociety: true,
  },
  {
    title: 'Society Master',
    icon: FileText,
    link: '/members',
    matchPaths: ['/members', '/receipts', '/bills'],
    roles: ['admin', 'employee'],
    pageTitle: 'Manage Societies',
    requiresSociety: true,
    subItems: [
      {
        title: 'Members',
        link: '/members',
        matchPaths: ['/members', '/members/create', '/members/update'],
        pageTitle: 'Members',
      },
      {
        title: 'Bill Processing',
        link: '/bills',
        matchPaths: ['/bills', '/bills/create', '/bills/update'],
        pageTitle: 'Bill Processing',
      },
      {
        title: 'Receipts',
        link: '/receipts',
        matchPaths: ['/receipts', '/receipts/create', '/receipts/update'],
        pageTitle: 'Receipts',
      },
    ],
  },
  {
    title: 'Account Master',
    icon: Users,
    link: '/account-process',
    matchPaths: ['/account-process', '/book-master', '/vouchers'],
    roles: ['admin'],
    pageTitle: 'Account Process',
    requiresSociety: true,
    subItems: [
      {
        title: 'Book Master',
        link: '/book-master',
        matchPaths: [
          '/book-master',
          '/book-master/create',
          '/book-master/update',
        ],
        pageTitle: 'Book Master',
      },
      {
        title: 'Vouchers',
        link: '/vouchers',
        matchPaths: ['/vouchers', '/vouchers/create', '/vouchers/update'],
        pageTitle: 'Vouchers',
      },
    ],
  },
];
