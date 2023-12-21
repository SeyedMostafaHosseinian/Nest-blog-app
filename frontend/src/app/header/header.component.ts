import { UserInterface } from 'src/types/user.interface';
import { UserService } from '../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user?: UserInterface | null
  constructor(public readonly userService: UserService) {

  }
  ngOnInit(): void {
    this.user = this.userService.getUser()
       this.userService.user.subscribe((userData) => {
        this.user = userData;
      })
  }
}
