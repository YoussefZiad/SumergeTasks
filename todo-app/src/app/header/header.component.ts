import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../models/auth.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  private authService = inject(AuthService);
  currentUser = signal<User | null>(null);

  ngOnInit(): void {
    this.currentUser.set(this.authService.currentUser.getValue());
  }

  logout() {
    this.authService.logout();
  }
  
}
