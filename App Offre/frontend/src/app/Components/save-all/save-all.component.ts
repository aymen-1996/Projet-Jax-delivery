import { Component, ElementRef, ViewChild } from '@angular/core';
import { SaveAllService } from 'src/app/Services/save-all.service';

@Component({
  selector: 'app-save-all',
  templateUrl: './save-all.component.html',
  styleUrls: ['./save-all.component.css']
})
export class SaveAllComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  selectedFile: File | null = null;  
  users: any;
  successMessage: string = '';

  constructor(private uploadService: SaveAllService) {}

  ngOnInit(): void {
    this.users = JSON.parse(localStorage.getItem('currentUser') as string);
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  importExcel(): void {
    if (!this.selectedFile) {
      alert('Please select a file.');
      return;
    }

    const userId = this.users.user.id;
    this.uploadService.uploadExcelFile(userId, this.selectedFile).subscribe(
      response => {
        console.log(response);
        this.successMessage = 'File uploaded successfully.';
        this.clearFileInput();
        this.selectedFile = null;
      },
      error => {
        console.error(error);
        alert('Error uploading file.');
      }
    );
  }

  clearFileInput(): void {
    const fileInputElement = this.fileInput.nativeElement as HTMLInputElement;
    fileInputElement.value = ''; 
    this.selectedFile = null; 
  }
}
