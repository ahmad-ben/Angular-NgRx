import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';
import { CourseEntityService } from './course-entity.service';
@Injectable()
export class CoursesResolver implements Resolve<boolean>{
  constructor(private coursesEntityInstance: CourseEntityService){}
  resolve(route, state): Observable<boolean> {
    return this.coursesEntityInstance.loaded$
      .pipe(
        tap(loaded => {
          if(!loaded){
            this.coursesEntityInstance.getAll()
          }
        }),
        filter(para => para),
        first(),
      )
  }
}
