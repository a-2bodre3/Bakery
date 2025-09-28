import { Component } from '@angular/core';
import {Header} from '../header/header/header';
import {Footer} from '../footer/footer/footer';
import {RouterOutlet} from '@angular/router';
import {Home} from '../../../Features/home/home/home';
import {Products} from '../../../Features/products/products';
import {OurStory} from '../../../Features/out-story/our-story/our-story';
import {About} from '../../../Features/about/about/about';
import {Contact} from '../../../Features/contact/contact/contact';

@Component({
  selector: 'app-admin-layout',
  imports: [
    Header,
    Footer,
    RouterOutlet,
    Home,
    Products,
    OurStory,
    About,
    Contact
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {

}
