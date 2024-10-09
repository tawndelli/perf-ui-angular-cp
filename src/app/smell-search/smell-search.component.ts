import { Component, EventEmitter, Output } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { CommonModule } from '@angular/common';
import { DataService } from '../dataService';

@Component({
  selector: 'app-smell-search',
  standalone: true,
  imports: [SearchComponent, CommonModule],
  templateUrl: 'smell-search.component.html',
  styleUrl: './smell-search.component.css',
})
export class SmellSearchComponent {

  smellsArray: string[] = [];

  isMobileSize = false;

  constructor(private dataService: DataService) {
    this.dataService.isMobileSize.subscribe({
      next: newVal => {
        this.isMobileSize = newVal;
      }
    })
  }

  currentSmellUpdated(smell: string) {
    var currentSmellSpan = document.querySelector('.current-smell');
    currentSmellSpan!.innerHTML = smell;

    this.dataService.currentSmellUpdatedEvent.next(smell);
  }

  newSmellItemsAdded(smellItems: string[]) {
    var perfumeryMaterialsList = document.getElementById(
      'perfumery-materials-list'
    );
    // perfumeryMaterialsList!.innerHTML = '';
    document.getElementById('placeholder')?.remove();
    this.smellsArray = [];
    smellItems.forEach((x) => this.smellsArray.push(x));
  }

  public materialNameClick(event: any) {
    const listItems = document.querySelectorAll('.list-item');
    listItems.forEach((item) => {
      item.classList.remove('selected');
    });

    event.target.classList.add('selected');

    this.dataService.setCurrentMaterial(event.target.textContent);
  }
}
