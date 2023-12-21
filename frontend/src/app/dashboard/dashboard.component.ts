import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { UserInterface } from 'src/types/user.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  user!: UserInterface | null;

  constructor(private readonly userService: UserService) {}

  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.userService.user.subscribe((user) => {
      this.user = user;
    });
  }
}
