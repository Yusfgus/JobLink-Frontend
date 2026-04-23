import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { AuthFooterComponent } from "../../components/auth-footer/auth-footer.component";
import { AuthHeaderComponent } from "../../components/auth-header/auth-header.component";

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, AuthFooterComponent, AuthHeaderComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {

}
