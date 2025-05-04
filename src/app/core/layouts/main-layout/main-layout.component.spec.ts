import { TestBed } from '@angular/core/testing';
import { MainLayoutComponent } from './main-layout.component';
import { provideRouter } from '@angular/router'; // Mock router if needed

describe('MainLayoutComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent], // Import the standalone component
      providers: [
        provideRouter([]), // Provide a mock router if the component uses routing
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(MainLayoutComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
