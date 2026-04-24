import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { JobseekerHeaderComponent } from '../../components/jobseeker-header/jobseeker-header.component'
import { AuthFooterComponent } from "../../components/auth-footer/auth-footer.component";

@Component({
  selector: 'app-jobseeker-layout',
  standalone: true,
  imports: [RouterOutlet, JobseekerHeaderComponent, AuthFooterComponent],
  templateUrl: './jobseeker-layout.component.html',
  styleUrl: './jobseeker-layout.component.scss'
})
export class JobseekerLayoutComponent {

}
