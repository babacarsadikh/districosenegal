import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'btn-loading',
  templateUrl: './btn-loading.component.html',
  styleUrls: ['./btn-loading.component.scss']
})
export class BtnLoadingComponent implements OnInit {
  @Input('loading') loading: boolean;
  @Input('btnClass') btnClass: string;
  @Input('loadingText') loadingText = 'en cours ...';
  @Input('type') type: 'button' | 'submit' = 'submit';

  constructor() { }

  ngOnInit() {
  }

}
