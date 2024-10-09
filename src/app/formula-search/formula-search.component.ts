import { Component } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { DataService } from '../dataService';

@Component({
  selector: 'app-formula-search',
  standalone: true,
  imports: [SearchComponent],
  templateUrl: './formula-search.component.html',
  styleUrl: './formula-search.component.css',
})
export class FormulaSearchComponent {
  formulas!: Map<string, Formula>;

  isMobileSize = false;

  constructor(private dataService: DataService) {
    this.formulas = new Map<string, Formula>();

    dataService.isMobileSize.subscribe({
      next: newVal => this.windowSizeUpdated(newVal)
    })
  }

  windowSizeUpdated(isMobileSize: boolean){
    this.isMobileSize = isMobileSize;
  }

  currentMaterialUpdated(material: string) {
    var currentMaterialSpan = document.querySelector('.current-material');
    currentMaterialSpan!.innerHTML = material;
  }

  newFormulaItemsAdded(materialName: string, formulaData: any[]) {
    this.currentMaterialUpdated(materialName);

    this.formulas.clear();
    formulaData.forEach((x: any) => {
      var jsonObj = JSON.parse(x);
      var formula = new Formula(jsonObj['name']);

      var formulaItems = jsonObj['formulaitems'] as FormulaItem[];
      formulaItems.forEach((f: any) => {
        formula.FormulaItems.push(new FormulaItem(f['material'], f['amount']));
      });

      this.formulas.set(jsonObj['name'], formula);
    });

    var formulasList = document.getElementById('formulas-list');
    formulasList!.innerHTML = '';
    formulasList!.scrollTop = formulasList!.scrollHeight;

    const formulaGridBody = document.getElementById('formula-grid-body');
    formulaGridBody!.innerHTML = '';

    for (let key of this.formulas.keys()) {
      const listItem = document.createElement('div');
      listItem.classList.add('list-item');
      listItem.textContent = key;
      formulasList!.appendChild(listItem);
    }

    const listItems = document.querySelectorAll('#formulas-list div');
    listItems.forEach((item) => {
      item.addEventListener('click', this.formulaNameClick.bind(this));
    });

    this.dataService.onFormulaItemsAdded();
  }

  formulaNameClick(event: any) {
    var formulaName = event.target.textContent;

    const listItems = document.querySelectorAll('#formulas-list div');
    listItems.forEach((item) => {
      item.classList.remove('selected');
    });

    event.target.classList.add('selected');

    // Populate the formula grid
    const formulaGridBody = document.getElementById('formula-grid-body');
    formulaGridBody!.innerHTML = '';
    this.formulas.get(formulaName)!.FormulaItems.forEach((f) => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${f.Material}</td><td>${f.Amount}</td>`;
      formulaGridBody!.appendChild(row);
    });

    const formulaGrid = document.querySelector('.formula-grid');
    formulaGrid!.scrollTop = 0;
  }
}

class Formula {
  Name: string;
  FormulaItems: FormulaItem[];
  constructor(name: string) {
    this.Name = name;
    this.FormulaItems = [];
  }
}

class FormulaItem {
  Material:string;
  Amount:number;
  constructor(material:string, amount:number) {
    this.Material = material;
    this.Amount = amount;
  }
}
