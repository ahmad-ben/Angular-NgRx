import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap, throttleTime, withLatestFrom } from 'rxjs/operators';
import { Course } from '../model/course';
import { Lesson } from '../model/lesson';
import { CourseEntityService } from '../services/course-entity.service';
import { LessonEntityService } from '../services/lesson-entity.service';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseComponent implements OnInit {
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;
  loading$: Observable<boolean>;
  displayedColumns = ['seqNo', 'description', 'duration'];
  nextPage = 0;
  constructor(
    private route: ActivatedRoute,
    private courseEntityService: CourseEntityService,
    private lessonEntityService: LessonEntityService,
    ){}
  ngOnInit() {
    const courseUrl = this.route.snapshot.paramMap.get("courseUrl");
    this.course$ = this.courseEntityService.entities$
      .pipe(
        map(courses => courses.find(course => course.url == courseUrl))
      );
    this.lessons$ = this.lessonEntityService.entities$
      .pipe(
        withLatestFrom(this.course$),
        tap(([arrayLessons, course]) => {
          if(this.nextPage == 0){
            this.loadLessonsPage(course)
          }
        }),
        map(([arrayLessons, course]) => {
          console.log(arrayLessons);
          console.log(course);
          return arrayLessons.filter(lesson => lesson.courseId == course.id)
        }),
      )
    this.loading$ = this.lessonEntityService.loaded$.pipe(
      tap(value => {console.log(value)}),
      throttleTime(100),
    );
  }
  loadLessonsPage(course: Course) {
    this.lessonEntityService.getWithQuery({
      'courseId': (course.id).toString(),
      'pageNumber': (this.nextPage).toString(),
      'pageSize': '3',
    })
    this.nextPage += 1;
  }
}
