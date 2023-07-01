import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { Item } from '../models/item.interface';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  http = inject(HttpClient);
  apiURLItem = `${environment.apiURL}/item`;

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiURLItem);
  }

  getItem(itemId: string): Observable<Item> {
    return this.http.get<Item>(`${this.apiURLItem}/${itemId}`);
  }

  createItem(itemData: FormData): Observable<Item> {
    return this.http.post<Item>(`${this.apiURLItem}`, itemData);
  }

  updateItem(itemData: FormData, itemId: string): Observable<Item> {
    return this.http.put<Item>(`${this.apiURLItem}/${itemId}`, itemData);
  }

  deleteItem(itemId: string): Observable<string> {
    return this.http.delete(`${this.apiURLItem}/${itemId}`, {
      responseType: 'text',
    });
  }
}
