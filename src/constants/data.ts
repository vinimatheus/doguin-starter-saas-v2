import { NavItem } from '@/types';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Configuração',
    url: '/dashboard/configuracao/perfil',
    icon: 'settings',
    isActive: false,
    shortcut: ['c', 'c'],
    items: [
      {
        title: 'Perfil',
        url: '/dashboard/configuracao/perfil',
        icon: 'user',
        isActive: false,
        shortcut: ['p', 'p'],
        items: [] // Empty array as there are no child items for Perfil
      }
    ]
  }
];
