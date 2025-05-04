import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { TableData } from '../../core/models/table-data.model';

@Component({
  selector: 'app-data-table',
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent {
	@Input() tableData!: TableData;
}
