import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface IMenuItem {
    id?: string;
    title?: string;
    description?: string;
    type: string;       // Possible values: link/dropDown/extLink
    name?: string;      // Used as display text for item and title for separator type
    state?: string;     // Router state
    icon?: string;      // Material icon name
    tooltip?: string;   // Tooltip text
    disabled?: boolean; // If true, item will not be appeared in sidenav.
    sub?: IChildItem[]; // Dropdown items
    badges?: IBadge[];
    active?: boolean;
}
export interface IChildItem {
    id?: string;
    parentId?: string;
    type?: string;
    name: string;       // Display text
    state?: string;     // Router state
    icon?: string;
    sub?: IChildItem[];
    active?: boolean;
}

interface IBadge {
    color: string;      // primary/accent/warn/hex color codes(#fff000)
    value: string;      // Display text
}

interface ISidebarState {
    sidenavOpen?: boolean;
    childnavOpen?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    public sidebarState: ISidebarState = {
        sidenavOpen: true,
        childnavOpen: false
    };
    selectedItem: IMenuItem;

    constructor() {
    }

    defaultMenu: IMenuItem[] = [
        {
            name: 'TABLEAU DE BORD',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            type: 'link',
            icon: 'i-Bar-Chart',
            state: '/dashboard/v2'

        },
         {
              name: 'BON DE LIVRAISON',
              description: '',
              type: 'link',
              icon: 'i-Receipt-3',
              state: '/bonlivraison'
          },
        // {
        //     name: 'UI kits',
        //     description: 'Lorem ipsum dolor sit amet, consectetur adipisicing.',
        //     type: 'dropDown',
        //     icon: 'i-Library',
        //     sub: [
        //         { icon: 'i-Bell', name: 'Alerts', state: '/uikits/alerts', type: 'link' },
        //         { icon: 'i-Split-Horizontal-2-Window', name: 'Accordions', state: '/uikits/accordions', type: 'link' },
        //         { icon: 'i-Medal-2', name: 'Badges', state: '/uikits/badges', type: 'link' },
        //         {
        //             icon: 'i-Arrow-Right-in-Circle',
        //             name: 'Buttons',
        //             type: 'dropDown',
        //             sub: [
        //                 { name: 'Bootstrap Buttons', state: '/uikits/buttons', type: 'link' },
        //                 { name: 'Loding Buttons', state: '/uikits/buttons-loading', type: 'link' }
        //             ]
        //         },
        //         { icon: 'i-ID-Card', name: 'Cards', state: '/uikits/cards', type: 'link' },
        //         { icon: 'i-Line-Chart-2', name: 'Cards metrics', state: '/uikits/cards-metrics', type: 'link' },
        //         { icon: 'i-Credit-Card', name: 'Cards widget', state: '/uikits/cards-widget', type: 'link' },
        //         { icon: 'i-Full-Cart', name: 'Cards ecommerce', state: '/uikits/cards-ecommerce', type: 'link' },
        //         { icon: 'i-Duplicate-Window', name: 'Modals', state: '/uikits/modals', type: 'link' },
        //         { icon: 'i-Speach-Bubble-3', name: 'Popover', state: '/uikits/popover', type: 'link' },
        //         { icon: 'i-Like', name: 'Rating', state: '/uikits/rating', type: 'link' },
        //         { icon: 'i-Loading-3', name: 'Loaders', state: '/uikits/loaders', type: 'link' },
        //     ]
        // },
        {
            name: 'BON DE COMMANDE',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            type: 'link',
            icon: 'i-File-Clipboard-File--Text',
            state: '/invoice'
            // sub: [
            //     { icon: 'i-Add-File', name: 'Invoice Builder', state: '/invoice', type: 'link' },
            //     { icon: 'i-Email', name: 'Inbox', state: '/inbox', type: 'link' },
            //     { icon: 'i-Speach-Bubble-3', name: 'Chat', state: '/chat', type: 'link' },
            //     { icon: 'i-Calendar', name: 'Calendar', state: '/calendar', type: 'link' },
            // ]
        },
        {
          name: 'CHAUFFEUR',
          description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
          type: 'link',
          icon: 'i-Jeep',
          state: '/chauffeur'
          // sub: [
          //     { icon: 'i-Add-File', name: 'Invoice Builder', state: '/invoice', type: 'link' },
          //     { icon: 'i-Email', name: 'Inbox', state: '/inbox', type: 'link' },
          //     { icon: 'i-Speach-Bubble-3', name: 'Chat', state: '/chat', type: 'link' },
          //     { icon: 'i-Calendar', name: 'Calendar', state: '/calendar', type: 'link' },
          // ]
      },
      {
        name: 'CLIENTS',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        type: 'link',
        icon: 'i-Business-ManWoman',
        state: '/client'
        // sub: [
        //     { icon: 'i-Add-File', name: 'Invoice Builder', state: '/invoice', type: 'link' },
        //     { icon: 'i-Email', name: 'Inbox', state: '/inbox', type: 'link' },
        //     { icon: 'i-Speach-Bubble-3', name: 'Chat', state: '/chat', type: 'link' },
        //     { icon: 'i-Calendar', name: 'Calendar', state: '/calendar', type: 'link' },
        // ]
    },
    {
      name: 'OPERATEURS',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      type: 'link',
      icon: 'i-Business-ManWoman',
      state: '/operateur'
      // sub: [
      //     { icon: 'i-Add-File', name: 'Invoice Builder', state: '/invoice', type: 'link' },
      //     { icon: 'i-Email', name: 'Inbox', state: '/inbox', type: 'link' },
      //     { icon: 'i-Speach-Bubble-3', name: 'Chat', state: '/chat', type: 'link' },
      //     { icon: 'i-Calendar', name: 'Calendar', state: '/calendar', type: 'link' },
      // ]
  },
        // {
        //     name: 'Forms',
        //     description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        //     type: 'dropDown',
        //     icon: 'i-File-Clipboard-File--Text',
        //     sub: [
        //         { icon: 'i-File-Clipboard-Text--Image', name: 'Basic components', state: '/forms/basic', type: 'link' },
        //         { icon: 'i-Split-Vertical', name: 'Form layouts', state: '/forms/layouts', type: 'link' },
        //         { icon: 'i-Receipt-4', name: 'Input Group', state: '/forms/input-group', type: 'link' },
        //         { icon: 'i-File-Edit', name: 'Input Mask', state: '/forms/input-mask', type: 'link' },
        //         { icon: 'i-Width-Window', name: 'Wizard', state: '/forms/wizard', type: 'link' },
        //         { icon: 'i-Crop-2', name: 'Image Cropper', state: '/forms/img-cropper', type: 'link' },
        //     ]
        // },
        // {
        //     name: 'Data Tables',
        //     description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        //     type: 'dropDown',
        //     icon: 'i-File-Horizontal-Text',
        //     sub: [
        //         { icon: 'i-File-Horizontal-Text', name: 'List', state: '/tables/list', type: 'link' },
        //         { icon: 'i-Full-View-Window', name: 'Bootstrap Table', state: '/tables/bootstrap-table', type: 'link' },
        //     ]
        // },
        // {
        //     name: 'Sessions',
        //     description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        //     type: 'dropDown',
        //     icon: 'i-Administrator',
        //     sub: [
        //         { icon: 'i-Add-User', name: 'Sign up', state: '/sessions/signup', type: 'link' },
        //         { icon: 'i-Checked-User', name: 'Sign in', state: '/sessions/signin', type: 'link' },
        //         { icon: 'i-Find-User', name: 'Forgot', state: '/sessions/forgot', type: 'link' }
        //     ]
        // },
        // {
        //     name: 'Pages',
        //     description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        //     type: 'dropDown',
        //     icon: 'i-Windows-2',
        //     sub: [
        //         { icon: 'i-Male', name: 'User Profile', state: '/pages/profile', type: 'link' }
        //     ]
        // },
        // {
        //     name: 'Icons',
        //     description: '600+ premium icons',
        //     type: 'link',
        //     icon: 'i-Cloud-Sun',
        //     state: '/icons/iconsmind'
        // },
        // {
        //     name: 'Others',
        //     description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        //     type: 'dropDown',
        //     icon: 'i-Double-Tap',
        //     sub: [
        //         { icon: 'i-Error-404-Window', name: 'Not found', state: '/others/404', type: 'link' }
        //     ]
        // },
        // {
        //     name: 'Doc',
        //     type: 'extLink',
        //     tooltip: 'Documentation',
        //     icon: 'i-Safe-Box1',
        //     state: 'http://demos.ui-lib.com/gull-doc'
        // }
    ];


    // sets iconMenu as default;
    menuItems = new BehaviorSubject<IMenuItem[]>(this.defaultMenu);
    // navigation component has subscribed to this Observable
    menuItems$ = this.menuItems.asObservable();

    // You can customize this method to supply different menu for
    // different user type.
    // publishNavigationChange(menuType: string) {
    //   switch (userType) {
    //     case 'admin':
    //       this.menuItems.next(this.adminMenu);
    //       break;
    //     case 'user':
    //       this.menuItems.next(this.userMenu);
    //       break;
    //     default:
    //       this.menuItems.next(this.defaultMenu);
    //   }
    // }
}
