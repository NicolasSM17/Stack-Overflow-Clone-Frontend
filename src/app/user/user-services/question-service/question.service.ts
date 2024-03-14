import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/auth-services/storage-service/storage.service';

const BASIC_URL = ["http://localhost:8080/"]

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient) { }

  postQuestion(questionDto: any): Observable<any>{
    questionDto.userId = StorageService.getUserId();

    console.log(questionDto);

    return this.http.post<[]>(BASIC_URL + "api/question", questionDto, {headers: this.createAuthorizationHeader()});
  }

  getAllQuestion(pageNumber: number): Observable<any>{
    return this.http.get<[]>(BASIC_URL + `api/questions/${pageNumber}`, {headers: this.createAuthorizationHeader()});
  }

  getQuestionById(questionId: number): Observable<any>{
    return this.http.get<[]>(BASIC_URL + `api/question/${questionId}`, {headers: this.createAuthorizationHeader()});
  }

  getQuestionByUserId(pageNumber: number): Observable<any>{
    return this.http.get<[]>(BASIC_URL + `api/questions/${StorageService.getUserId()}/${pageNumber}`,{headers: this.createAuthorizationHeader()});
  }

  addVoteToQuestion(voteQuestionDto: any): Observable<any>{
    return this.http.post<[]>(BASIC_URL + "api/vote", voteQuestionDto, {headers: this.createAuthorizationHeader()});
  }

  createAuthorizationHeader(): HttpHeaders{
    let authHeaders: HttpHeaders = new HttpHeaders();

    return authHeaders.set("Authorization", "Bearer " + StorageService.getToken());
  }
}
