import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gender } from '../models/api-models/gender.models';

@Injectable({
  providedIn: 'root'
})
export class GenderService {

  private baseApiUrl = 'https://dev.tks.co.th/studentapi'

  constructor(private httpClient: HttpClient) { }

  getGenderList() {
    return this.httpClient.get<Gender[]>(this.baseApiUrl + '/Genders');
  }
}
