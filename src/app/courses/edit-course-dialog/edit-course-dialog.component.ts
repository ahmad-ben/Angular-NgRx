import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Course } from '../model/course';
import { CourseEntityService } from '../services/course-entity.service';

@Component({
  selector: 'course-dialog',
  templateUrl: './edit-course-dialog.component.html',
  styleUrls: ['./edit-course-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class EditCourseDialogComponent {
  form: FormGroup;
  dialogTitle: string;
  course: Course;
  mode: 'create' | 'update';
  loading$:Observable<boolean>;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditCourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private courseEntityService: CourseEntityService
  )
  {
    this.dialogTitle = data.dialogTitle;
    this.course = data.course;
    this.mode = data.mode;
    const formControls = {
      description: ['', Validators.required],
      category: ['', Validators.required],
      longDescription: ['', Validators.required],
      promo: ['', []]
    };
    if (this.mode == 'update') {
      this.form = this.fb.group(formControls);
      this.form.patchValue({...data.course});
    }
    else if (this.mode == 'create') {
      this.form = this.fb.group({
        ...formControls,
        url: ['', Validators.required],
        iconUrl: ['', Validators.required]
      });
    }
  }
  onClose() {
    this.dialogRef.close();
  }
  onSave() {
    const course: Course = {
      ...this.course,
      ...this.form.value,
      // id: 100,
    };
    if(this.mode == 'update'){
      this.courseEntityService.update(course);
    }else if (this.mode == 'create') {
      console.log(course);
      this.courseEntityService.add(course)
        .subscribe({
          next: () => this.dialogRef.close()
        });
    }
    this.dialogRef.close();
  }
}
