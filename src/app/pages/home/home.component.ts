import { HeaderComponent } from '../../components/header/header.component';
import { Footer } from '../../components/footer/footer';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  id: number;
  text: string;
  authorName: string;
  authorTitle: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CommonModule, Footer],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit, OnDestroy  {
  testimonials: Testimonial[] = [
    {
      id: 1,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.',
      authorName: 'John Anderson',
      authorTitle: 'CEO, Tech Solutions Inc.'
    },
    {
      id: 2,
      text: 'Working with ACDS Tax Management has transformed our business approach to fiscal planning. Their expertise in international taxation saved us significant resources and provided peace of mind.',
      authorName: 'Sarah Mitchell',
      authorTitle: 'CFO, Global Enterprises'
    },
    {
      id: 3,
      text: 'The team at ACDS provided exceptional guidance during our startup phase. Their personalized approach and deep knowledge helped us navigate complex tax regulations with confidence.',
      authorName: 'Michael Chen',
      authorTitle: 'Founder, InnovateCo'
    }
  ];

  currentIndex = 0;
  autoPlayInterval: any;
  autoPlayDuration = 5000; // 5 seconds

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  get currentTestimonial(): Testimonial {
    return this.testimonials[this.currentIndex];
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    this.resetAutoPlay();
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    this.resetAutoPlay();
  }

  prevSlide(): void {
    this.currentIndex = this.currentIndex === 0 
      ? this.testimonials.length - 1 
      : this.currentIndex - 1;
    this.resetAutoPlay();
  }

  startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayDuration);
  }

  stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  resetAutoPlay(): void {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}
