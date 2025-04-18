import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';

@Component({
  selector: 'app-accordions',
  templateUrl: './accordions.component.html',
  styleUrls: ['./accordions.component.scss'],
  animations: [SharedAnimations]
})
export class AccordionsComponent implements OnInit {
  code = `
  <div ngbAccordion>
	<div ngbAccordionItem [collapsed]="false">
		<h2 ngbAccordionHeader>
			<button ngbAccordionButton>Simple</button>
		</h2>
		<div ngbAccordionCollapse>
			<div ngbAccordionBody>
				<ng-template>
					Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon
					officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf
					moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim
					keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur
					butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably
					haven't heard of them accusamus labore sustainable VHS.
				</ng-template>
			</div>
		</div>
	</div>
	<div ngbAccordionItem>
		<h2 ngbAccordionHeader>
			<button ngbAccordionButton>
				<span>&#9733; <b>Fancy</b> title &#9733;</span>
			</button>
		</h2>
		<div ngbAccordionCollapse>
			<div ngbAccordionBody>
				<ng-template>
					Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon
					officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf
					moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim
					keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur
					butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably
					haven't heard of them accusamus labore sustainable VHS.
				</ng-template>
			</div>
		</div>
	</div>
	<div ngbAccordionItem [disabled]="true">
		<h2 ngbAccordionHeader>
			<button ngbAccordionButton>Disabled</button>
		</h2>
		<div ngbAccordionCollapse>
			<div ngbAccordionBody>
				<ng-template>
					Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon
					officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf
					moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim
					keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur
					butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably
					haven't heard of them accusamus labore sustainable VHS.
				</ng-template>
			</div>
		</div>
	</div>
</div>`;
  constructor() { }

  ngOnInit() {
  }

}
