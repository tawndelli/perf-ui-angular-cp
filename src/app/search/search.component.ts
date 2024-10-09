import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SmellSearchComponent } from '../smell-search/smell-search.component';
import { Output, EventEmitter } from '@angular/core';
import { DataService } from '../dataService';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SmellSearchComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  @Input() searchType!: string;
  @Output() newSmellItemsEvent = new EventEmitter<string[]>();
  @Output() currentSmellUpdatedEvent = new EventEmitter<string>();
  @Output() newFormulaItemsEvent = new EventEmitter<{materialName: string, formulaData: string[]}>();
  @Output() newAssistantMessageEvent = new EventEmitter<string>();
  @Output() newUserMessageEvent = new EventEmitter<string>();

  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('searchBtn') searchBtn!: ElementRef;

  private searchBtnText: any;
  private searchBtnSpinner: any;
  placeholderText!: string;

  constructor(private dataService: DataService) {
    this.placeholderText = '';
  }

  ngAfterContentInit() {
    switch (this.searchType) {
      case 'smell':
        this.placeholderText = 'Search by smell (e.g. banana)...';
        break;
      case 'material':
        this.placeholderText = 'Search formulas by material or name...';
        break;
      default:
        this.placeholderText = 'Ask a question...';
    }
  }

  ngAfterViewInit() {
    this.dataService.setCurrentMaterialEvent.subscribe((material) => {
      this.smellMaterialSelected(material);
    });

    this.searchBtnText =
      this.searchBtn.nativeElement.querySelector('.search-btn-text');
    this.searchBtnSpinner =
      this.searchBtn.nativeElement.querySelector('.spinner');
  }

  smellMaterialSelected(material: string) {
    if (this.searchType == 'material') {
      this.searchInput.nativeElement.value = material;
      this.onSearch(material, 'material');
    }
  }

  public async onSearch(query: string, searchType: string = '') {
    if (query == '') {
      return;
    }

    this.setWaitElements();

    var searchKind = '';

    if (searchType == '') {
      searchKind = this.searchType;
    } else {
      searchKind = searchType;
    }

    switch (searchKind) {
      case 'smell':
        this.currentSmellUpdatedEvent.emit(query);
        var materials: string[];

        this.dataService.getRequestResults('smell:' + query).then((result) => {
          materials = result['smells'];
          this.newSmellItemsEvent.emit(materials);

          this.resetWaitElements();
        });
        break;

      case 'material':
        var formulas: any[];

        this.dataService
          .getRequestResults('material:' + query)
          .then((result) => {
            formulas = [];
            result.forEach((x: any) => {
              formulas.push(x);
            });
            this.newFormulaItemsEvent.emit({materialName: query, formulaData: formulas});

            this.resetWaitElements();
          });
        break;

      default:
        this.newUserMessageEvent.emit(query);

        this.searchInput.nativeElement.value = "";

        this.dataService.getRequestResults(query).then((result) => {
          this.newAssistantMessageEvent.emit(result);
          this.resetWaitElements();
        });
    }
  }

  onInputKeyDown(event: any) {
    if (event.key == 'Enter') {
      this.onSearch(event.target.value);
    }
  }

  setWaitElements() {
    document.body.style.cursor = 'wait';

    this.searchInput.nativeElement.disabled = true;
    this.searchBtnText!.style.display = 'none'; // Hide button text
    this.searchBtnSpinner!.style.display = 'inline-block'; // Display spinner
    this.searchBtn.nativeElement.disabled = true;
  }

  resetWaitElements() {
    document.body.style.cursor = 'default';

    this.searchInput.nativeElement.disabled = false;
    this.searchBtnText.style.display = 'inline-block'; // Display button text
    this.searchBtnSpinner.style.display = 'none'; // Hide spinner
    this.searchBtn.nativeElement.disabled = false;
  }
}
