import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private _currentMaterial = new BehaviorSubject('');
  setCurrentMaterialEvent = this._currentMaterial.asObservable();

  public isMobileSize = new BehaviorSubject<boolean>(false);
  setMobileSizeEvent = this.isMobileSize.asObservable();

  formulaItemsAddedEvent = new BehaviorSubject(null);

  currentSmellUpdatedEvent = new BehaviorSubject<string>('');

  constructor() {}

  apiUrl: string = 'https://perf-ro2n5vkzvq-uc.a.run.app/answer_query/';
  // apiUrl: string = 'http://localhost:8000/answer_query/';

  async getRequestResults(query: string) {
    const url = new URL(this.apiUrl);
    url.searchParams.append('query', query);

    try {
      var response = await fetch(url.toString(), {
        method: 'GET',
        // You can add headers or body payload if required
      });

      if (!response.ok) {
        throw new Error('Network response not ok.');
      }

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return "There was an error processing your request. Please try again in a moment.";
    }
  }

  setCurrentMaterial(material: any) {
    this._currentMaterial.next(material);
  }

  setMobileSize(newValue: boolean){
    this.isMobileSize.next(newValue);
  }

  onFormulaItemsAdded(){
    this.formulaItemsAddedEvent.next(null);
  }
}
