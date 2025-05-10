import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appAnimate]',
  standalone: true
})
export class AnimateDirective implements OnInit {
  @Input() appAnimate: 'fade' | 'slide' | 'scale' = 'fade';
  @Input() delay: number = 0;
  @Input() duration: number = 300;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const element = this.el.nativeElement;
    element.style.opacity = '0';
    element.style.transition = `all ${this.duration}ms ease-in-out`;

    // Add animation class based on type
    switch (this.appAnimate) {
      case 'fade':
        element.classList.add('animate-fade');
        break;
      case 'slide':
        element.classList.add('animate-slide');
        break;
      case 'scale':
        element.classList.add('animate-scale');
        break;
    }

    // Trigger animation after delay
    setTimeout(() => {
      element.style.opacity = '1';
    }, this.delay);
  }
}

// Add these styles to your global styles
/*
.animate-fade {
  opacity: 0;
  transform: translateY(10px);
}

.animate-fade.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.animate-slide {
  opacity: 0;
  transform: translateX(-20px);
}

.animate-slide.animate-in {
  opacity: 1;
  transform: translateX(0);
}

.animate-scale {
  opacity: 0;
  transform: scale(0.95);
}

.animate-scale.animate-in {
  opacity: 1;
  transform: scale(1);
}
*/ 