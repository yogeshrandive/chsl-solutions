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
    matchPaths: ['/dashboard'],
    roles: ['admin', 'employee'],
    pageTitle: 'Dashboard',
    requiresSociety: true,
  },
  {
    title: 'Society Management',
    icon: FileText,
    link: '/info/step1',
    matchPaths: ['/info/step1'],
    roles: ['admin', 'employee'],
    pageTitle: 'Manage Societies',
    requiresSociety: true,
    subItems: [
      {
        title: 'Information',
        link: '/info/step1',
        matchPaths: [
          '/info/step1',
          '/info/step2',
          '/info/step3',
          '/info/step4',
          '/info/step5',
          '/info/step6',
        ],
        pageTitle: 'Information',
      },
      {
        title: 'Members',
        link: '/members',
        matchPaths: ['/members', '/members/create', '/members/update'],
        pageTitle: 'Members',
      },
    ],
  },
  {
    title: 'Bill Management',
    icon: FileText,
    link: '/bills',
    matchPaths: ['/receipts', '/bills'],
    roles: ['admin', 'employee'],
    pageTitle: 'Manage Societies',
    requiresSociety: true,
    subItems: [
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
    title: 'Account management',
    icon: Users,
    link: '/account',
    matchPaths: ['/headgroup', '/accountmaster', '/bookmaster', '/vouchers'],
    roles: ['admin'],
    pageTitle: 'Account Process',
    requiresSociety: true,
    subItems: [
      {
        title: 'Account Head Group',
        link: '/headgroup',
        matchPaths: ['/headgroup', '/headgroup/create', '/headgroup/update'],
        pageTitle: 'Account management',
      },
      {
        title: 'Account Master',
        link: '/accountmaster',
        matchPaths: [
          '/accountmaster',
          '/accountmaster/create',
          '/accountmaster/update',
        ],
        pageTitle: 'Account Master',
      },
      {
        title: 'Book Master',
        link: '/bookmaster',
        matchPaths: ['/bookmaster', '/bookmaster/create', '/bookmaster/update'],
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
