import { GenderService } from './../../services/gender.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../student.service';
import { Component, OnInit } from '@angular/core';
import { Student } from 'src/app/models/ui-models/student.models';
import { Gender } from 'src/app/models/ui-models/gender.models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class ViewStudentComponent implements OnInit {
  studentId: string | null | undefined;
  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    mobile: 0,
    profileImageUrl: '',
    genderId: '',
    gender: {
      id: '',
      description: ''
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: ''
    }
  }

  isNewStudent = false;
  header ='';
  displayProfileImageUrl = '';

  genderList: Gender[] = [];

  constructor(private readonly StudentService: StudentService,
    private readonly route: ActivatedRoute,
    private readonly genderService: GenderService,
    private snakbar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => {
        this.studentId = params.get('id');

        if (this.studentId) {
          if (this.studentId.toLowerCase() === 'Add'.toLowerCase()) {
            // -> new Student Functionality
            this.isNewStudent = true;
            this.header = 'Add New Student';
            this.setImage();

          } else {
            // -> Existing Student Functionality
            this.isNewStudent = false;
            this.header = 'Edit Student';

            this.StudentService.getStudent(this.studentId)
            .subscribe({
              next: (res) => {
                this.student = res
                this.setImage();
              },
              error: (err) => {
                console.log(err);
                this.setImage();
              }
            }
            );

          }

          this.genderService.getGenderList()
            .subscribe({
              next: (res) => {
                this.genderList = res
              },
              error: (err) => {
                console.log(err);

              }
            }
          );
        }
      }
    );
  }

  onUpdate(): void {
    console.log(this.student);
    this.StudentService.updateStudent(this.student.id, this.student)
      .subscribe(
        (successResponse) => {
          // Show a notification
          this.snakbar.open('Student update successfully', undefined, {
            duration: 2000
          })
        },
        (errorResponse) => {
          // Log it
          console.log(errorResponse);
          
        }
      );

  }

  onDelete(): void {
    this.StudentService.deleteStudent(this.student.id)
      .subscribe(
        (successResponse) => {
          this.snakbar.open('Student deleted successfully', undefined, {
            duration: 2000
          });

          setTimeout(() => {
            this.router.navigateByUrl('students');
          }, 2000);
        },
        (errorResponse) => {
          // Log it
          console.log(errorResponse);
        }
      );
  }

  onAdd(): void {
    this.StudentService.addStudent(this.student)
      .subscribe(
        (successResponse) => {
          this.snakbar.open('Student added successfully', undefined, {
            duration: 2000
          });

          setTimeout(() => {
            this.router.navigateByUrl(`students/${successResponse.id}`);
          }, 2000);
        },
        (errorResponse) => {
          // Log it
          console.log(errorResponse);
      }
    );
  }

  uploadImage(event: any): void {
    if (this.studentId) {
      const file: File = event.target.files[0];
      this.StudentService.uploadImage(this.student.id, file)
      .subscribe(
        (successResponse) => {
          this.student.profileImageUrl = successResponse;
          this.setImage();

          // Show a notification
          this.snakbar.open('Profile Image Updated', undefined, {
            duration: 2000
          });

        },
        (errorResponse) => {
          // Log it
          console.log(errorResponse);
          
      }
    );
    }
  }

  private setImage(): void {
    if (this.student.profileImageUrl) {
      this.displayProfileImageUrl = this.StudentService.getImagePath(this.student.profileImageUrl);
    } else {
      // Display a default
      this.displayProfileImageUrl = '/assets/profile.png';
    }
  }
}
