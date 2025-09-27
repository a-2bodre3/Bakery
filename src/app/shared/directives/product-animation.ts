import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appProductAnimation]'
})
export class ProductAnimation {

  constructor(private el: ElementRef) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.style.transform = 'scale(1.05)';
    this.el.nativeElement.style.transition = 'all 0.3s ease-in-out';
    this.el.nativeElement.style.boxShadow = '2px 2px 8px rgba(128, 128, 128, 0.6)';
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.el.nativeElement.style.transform = 'scale(1)';
    this.el.nativeElement.style.transition = 'all 0.3s ease-in-out';
    this.el.nativeElement.style.boxShadow = 'none';
  }

}
