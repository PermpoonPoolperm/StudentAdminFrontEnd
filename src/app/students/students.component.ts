import { MatTableDataSource } from '@angular/material/table';
import { Student } from './../models/api-models/student.models';
import { StudentService } from './student.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit{
  students: Student[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'dateOfBirth', 'email', 'mobile', 'gender', 'edit'];
  dataSource: MatTableDataSource<Student> = new MatTableDataSource<Student>();
  @ViewChild(MatPaginator) matPaginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;
  filterString = ''; 

  constructor(private StudentService: StudentService) {}

  ngOnInit(): void {
    // Fetch Students
    this.StudentService.getStudents()
      .subscribe(
        (successResponse) => {
          this.students = successResponse;
          this.dataSource = new MatTableDataSource<Student>(this.students);

          if(this.matPaginator) {
            this.dataSource.paginator = this.matPaginator;
          }

          if(this.matSort) {
            this.dataSource.sort = this.matSort;
          }
        },
        (errorResponse) => {
          console.log(errorResponse);
        }
      );
  } 

  filterStudents() {
    this.dataSource.filter = this.filterString.trim().toLowerCase();
  }
}
