import { Component } from '@angular/core';
import {Header} from '../header/header/header';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-public-layout',
  imports: [
    Header,
    RouterOutlet
  ],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css'
})
export class PublicLayout {

}
