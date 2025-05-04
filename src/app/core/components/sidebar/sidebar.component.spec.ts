import { TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('SidebarComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
		imports: [SidebarComponent], // Import the standalone component
		providers: [
			{
			provide: ActivatedRoute,
			useValue: { params: of({}) }, // Mock ActivatedRoute
			},
		],
		}).compileComponents();
	});

	it('should create', () => {
		const fixture = TestBed.createComponent(SidebarComponent);
		const component = fixture.componentInstance;
		expect(component).toBeTruthy();
	});

	it('should have a defined menu array', () => {
		const fixture = TestBed.createComponent(SidebarComponent);
		const component = fixture.componentInstance;
		expect(component.menu).toBeDefined();
		expect(component.menu.length).toBeGreaterThan(0);
	});

	it('should have correct menu items', () => {
		const fixture = TestBed.createComponent(SidebarComponent);
		const component = fixture.componentInstance;
		expect(component.menu).toEqual([
			{ title: 'Dashboard', path: '/dashboard' },
			{ title: 'List', path: '/list' }
		]);
	});

	it('should render menu items in the template', () => {
		const fixture = TestBed.createComponent(SidebarComponent);
		fixture.detectChanges();
		const compiled = fixture.nativeElement as HTMLElement;
		const menuItems = compiled.querySelectorAll('a');
		expect(menuItems.length).toBe(2);
		expect(menuItems[0].textContent).toContain('Dashboard');
		expect(menuItems[1].textContent).toContain('List');
	});
});
