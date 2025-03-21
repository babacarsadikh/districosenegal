import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  
  year: number | string = '' ;

  constructor() { }

  ngOnInit() {
    this.year = (new Date()).getFullYear();
  }

}
