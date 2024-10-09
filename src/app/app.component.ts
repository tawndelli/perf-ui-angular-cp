import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SmellSearchComponent } from './smell-search/smell-search.component';
import { FormulaSearchComponent } from './formula-search/formula-search.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { CommonModule } from '@angular/common';
import { DataService } from './dataService';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SmellSearchComponent,
    FormulaSearchComponent,
    ChatbotComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Perf';

  menuActive = false;

  visibleSection = '';

  isMobileSize = false;

  splashVisible = false;

  constructor(private dataService: DataService){
    dataService.formulaItemsAddedEvent.subscribe({
      next: () => this.formulaItemsAdded()
    })

    dataService.currentSmellUpdatedEvent.subscribe({
      next: (smell) => this.currentSmellUpdated(smell),
    });
  }

  currentSmellUpdated(smell: string){
    if (smell != '')
      this.updateVisibleSection('smellSection');
  }

  formulaItemsAdded(){
    if (this.isMobileSize) {
      this.toggleSection('formulaSection');
    }
    this.updateVisibleSection('formulaSection');
  }

  @HostListener('window:load', ['$event'])
  onPageLoad(event: { currentTarget: { innerWidth: number } }) {
    if (event.currentTarget.innerWidth < 1000) {
      this.showSection('assistant');
      this.hideSection('formula-search');
      this.hideSection('smell-search');
      this.isMobileSize = true;
    }

    this.updateVisibleSection('assistantSection');
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: { target: { innerWidth: number } }) {
    if (event.target.innerWidth >= 1000) {
      this.showSection('smell-search');
      this.showSection('formula-search');
      this.showSection('assistant');

      this.isMobileSize = false;
    } else {
      if (this.visibleSection == '') {
        this.showSection('assistant');
        this.hideSection('smell-search');
        this.hideSection('formula-search');
        this.updateVisibleSection('assistantSection');
      } else {
        this.toggleSection(this.visibleSection);
      }

      this.isMobileSize = true;
    }

    this.dataService.isMobileSize.next(this.isMobileSize);
  }

  @HostListener('window:click', ['$event'])
  onWindowClick(event: { target: HTMLElement | null }) {
    var nav = document.getElementById('navMenu');
    if (event.target?.id != 'burger') {
      if (event.target?.id != 'navMenu' && this.menuActive) {
        this.menuActive = false;
      }
    }
  }

  toggleSection(sectionName: string) {
    switch (sectionName) {
      case 'smellSection':
        this.showSection('smell-search');
        this.hideSection('formula-search');
        this.hideSection('assistant');
        this.updateVisibleSection('smellSection');
        break;
      case 'formulaSection':
        this.showSection('formula-search');
        this.hideSection('smell-search');
        this.hideSection('assistant');
        this.updateVisibleSection('formulaSection');
        break;
      case 'assistantSection':
        this.showSection('assistant');
        this.hideSection('smell-search');
        this.hideSection('formula-search');
        this.updateVisibleSection('assistantSection');
        break;
    }

    this.closeMenu();
  }

  updateVisibleSection(sectionName: string) {
    this.visibleSection = sectionName;
    document.querySelectorAll<HTMLElement>('.burgerListItem').forEach((el) => {
      el.style.backgroundColor = '';
      el.classList.remove('selected');
    });

    var el = document.getElementById(sectionName);
    if(el != null){
      el.style.backgroundColor = '#dab200';
      el.classList.add('selected');
    }
  }

  aboutClick(){
    this.splashVisible = !this.splashVisible;
  }

  aboutClose(){
    this.aboutClick();
  }

  toggleMenu() {
    this.menuActive = !this.menuActive;
  }

  closeMenu() {
    this.menuActive = false;
  }

  showSection(sectionName: string) {
    var el = document.querySelector<HTMLElement>('.' + sectionName)!;
    el.parentElement!.style.display = 'flex';
    el.style.display = 'flex';
  }

  hideSection(sectionName: string) {
    var el = document.querySelector<HTMLElement>('.' + sectionName)!;
    el.parentElement!.style.display = 'none';
    el.style.display = 'none';
  }
}
