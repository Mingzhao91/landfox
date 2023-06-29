import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-ground-zero',
  templateUrl: './ground-zero.component.html',
  styleUrls: ['./ground-zero.component.scss'],
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule],
})
export class GroundZeroComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
