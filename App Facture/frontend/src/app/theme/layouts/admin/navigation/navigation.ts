import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  icon?: string;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}
const NavigationItems = [
  {
    id: 'dashboard',
    title: 'Tableau de bord',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Tableau de bord',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/default',
        icon: 'ti ti-dashboard',
        breadcrumbs: false
      }
    ]
  },
  
  {
    id: 'repertoire',
    title: 'répertoire',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'repertoire',
        title: 'répertoire',
        type: 'item',
        classes: 'nav-item',
        url: '/repertoire',
        icon: 'ti ti-user',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'documents',
    title: 'Documents',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'factures',
        title: 'Factures',
        type: 'item',
        classes: 'nav-item',
        url: '/facture',
        icon: 'ti ti-calendar',
        breadcrumbs: false
      },
      {
        id: 'contrat',
        title: 'Contrat',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/defaut',
        icon: 'ti ti-archive',
        breadcrumbs: false
      },{
        id: 'devis',
        title: 'Devis',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/defaut',
        icon: 'ti ti-receipt',
        breadcrumbs: false
      }
      
    ]
  },
 
  
  
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
