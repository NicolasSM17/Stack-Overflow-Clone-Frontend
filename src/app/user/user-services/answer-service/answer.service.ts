import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/auth-services/storage-service/storage.service';

const BASIC_URL = ["http://localhost:8080/"]

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  constructor(private http: HttpClient) { }

  postAnswer(answerDto: any): Observable<any>{
    return this.http.post<[]>(BASIC_URL + "api/answer", answerDto, {headers: this.createAuthorizationHeader()});
  }

  postAnswerImage(file: any, answerId: number):Observable<any>{
    return this.http.post<[]>(BASIC_URL + `api/image/${answerId}`, file, {headers: this.createAuthorizationHeader()});
  }

  createAuthorizationHeader(): HttpHeaders{
    let authHeaders: HttpHeaders = new HttpHeaders();

    return authHeaders.set("Authorization", "Bearer " + StorageService.getToken());
  }
}
