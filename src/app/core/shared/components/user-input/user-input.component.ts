import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserDataService } from '../../../service/user-data/user-data.service';

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class UserInputComponent {
  userData: any = {};

  constructor(private userDataService: UserDataService) {}

  onInputChange() {
    this.userDataService.setUserData(this.userData);
  }
}
