import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Menu } from '../../models/menu.model';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
	/**
		* Represents the menu items for the sidebar component.
		* Each menu item includes a title and a corresponding navigation path.
	*/
	menu: Menu[] = [
		{ title: 'Dashboard', path: '/dashboard' },
		{ title: 'List', path: '/list' }
	]
}
