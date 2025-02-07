import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class homeComponent implements OnInit {
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
}