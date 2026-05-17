import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Application } from '../../../core/abstractions/job';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApplicationsService } from '../../../core/services/jobs/applications.service';
import { ApplicationCardComponent } from '../../../components/application-card/application-card.component';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [
    CommonModule,
    ApplicationCardComponent,
    PaginatorModule,
  ],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss'
})
export class ApplicationsComponent {

  protected _applicationService: ApplicationsService = inject(ApplicationsService);
  private _spinner: NgxSpinnerService = inject(NgxSpinnerService);

  first: number = 0;
  rows: number = 10;

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;

    this.loadMore(event.page + 1, this.rows);
  }

  applications = this._applicationService.applications;

  ngOnInit(): void {
    this.loadMore(1, this.rows);
  }

  loadMore(pageNumber: number, pageSize: number): void {
    this._spinner.show();
    const req = this._applicationService.loadApplications(pageNumber, pageSize);
    if (req) {
      req.subscribe({
        next: () => this._spinner.hide(),
        error: () => this._spinner.hide()
      });
    } else {
      this._spinner.hide();
    }
  }
}
