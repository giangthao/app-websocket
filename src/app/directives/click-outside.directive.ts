import {
  Directive,
  ElementRef,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private readonly elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    //  console.log(this.elementRef.nativeElement);
    if (this.isVisible() === true) {
      //   console.log('visible? ', this.isVisible);
      const clickedInside = this.elementRef.nativeElement.contains(
        event.target
      );

      //  console.log('inside: ', clickedInside);

      if (!clickedInside) {
        this.clickOutside.emit();
      }
    }
  }

  private isVisible(): boolean {
    // Check the visibility state of the element
    return !!this.elementRef.nativeElement;
  }
}
