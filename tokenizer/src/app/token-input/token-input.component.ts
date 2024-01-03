// token-input.component.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AutocompleteService } from '../autocomplete.service';

@Component({
  selector: 'app-token-input',
  templateUrl: './token-input.component.html',
  styleUrls: ['./token-input.component.css']
})
export class TokenInputComponent {
  inputValue = '';
  tokens: string[] = [];
  suggestions: string[] = [];

  @Output() tokenAdded = new EventEmitter<string>();
  @Output() tokenRemoved = new EventEmitter<string>();

  constructor(private http: HttpClient, private autocompleteService: AutocompleteService) {}

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',' || event.key === ' ') {
      event.preventDefault();
      this.addToken();
    }
  }

  addToken(): void {
    const trimmedValue = this.inputValue.trim();
    if (trimmedValue && !this.tokens.includes(trimmedValue)) {
      if (this.suggestions.includes(trimmedValue)) {
        this.tokens.push(trimmedValue);
        this.tokenAdded.emit(trimmedValue);
        this.inputValue = '';
      } else {
        this.autocompleteService.addName(trimmedValue).subscribe(
          () => {
            this.tokens.push(trimmedValue);
            this.tokenAdded.emit(trimmedValue);
            this.inputValue = '';
          },
          error => {
            console.error('Error adding name to database:', error);
          }
        );
      }
    }
  }

  removeToken(token: string): void {
    const index = this.tokens.indexOf(token);
    if (index !== -1) {
      this.tokens.splice(index, 1);
      this.tokenRemoved.emit(token);
    }
  }

  fetchNames(): Observable<string[]> {
    return this.http.get<string[]>('/api/names');
  }

  

  // Existing code...

  onInput(): void {
    this.autocompleteService.getAutocompleteSuggestions(this.inputValue).subscribe(
      suggestions => {
        this.suggestions = suggestions;
      },
      error => {
        console.error('Error fetching autocomplete suggestions:', error);
      }
    );
  }

  selectSuggestion(suggestion: string): void {
    this.inputValue = suggestion;
    this.addToken();
  }
}
