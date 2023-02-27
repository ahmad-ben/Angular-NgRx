import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../model/course';
@Injectable()
export class CoursesDataService extends DefaultDataService<Course>{
  constructor(http: HttpClient, httpUrlGenerate: HttpUrlGenerator){
    super('Course', http, httpUrlGenerate);
  }
  getAll(): Observable<Course[]> {
    return this.http.get('/api/courses')
      .pipe(
        map(para => para['payload'])
      )
  }
}
