import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink],
})
export class HeaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
