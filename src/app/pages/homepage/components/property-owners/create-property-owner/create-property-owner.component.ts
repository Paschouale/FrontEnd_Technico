import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PropertyOwnerService } from '../../../../../shared/services/property-owner.service';
import { EMPTY, catchError } from 'rxjs';

@Component({
  selector: 'app-create-property-owner',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-property-owner.component.html',
  styleUrls: ['./create-property-owner.component.scss']
})
export class CreatePropertyOwnerComponent implements OnInit{
  propertyOwnerForm!: FormGroup;

  constructor(private propertyOwnerService: PropertyOwnerService, private router : Router){}

  ngOnInit(): void {
    this.propertyOwnerForm = new FormGroup({
      vatNumber: new FormControl("", [Validators.required, Validators.pattern("\\d{9}")]),
      name: new FormControl("", Validators.required),
      surname: new FormControl("", Validators.required),
      address: new FormControl(""),
      phoneNumber: new FormControl("", Validators.pattern("^[26]\\d{9}$")),
      email: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")]),
      loginUser: new FormGroup({
        username: new FormControl("", [Validators.required, Validators.minLength(5)]),
        password: new FormControl("", [Validators.required, Validators.minLength(4)]),
      })
    });
  }

  onSubmit(){
    console.log(this.propertyOwnerForm)
    if (this.propertyOwnerForm.valid) {
      const formValue = {
        ...this.propertyOwnerForm.value,
        loginUser: {
          username: this.propertyOwnerForm.get('loginUser.username')?.value,
          password: this.propertyOwnerForm.get('loginUser.password')?.value,
        },
      };
      this.propertyOwnerService.createPropertyOwner(formValue)
      .pipe(catchError((err) => {
        console.log(err);
        alert(err.error);
        return EMPTY
      }))
      .subscribe(() =>{
        alert('Property Owner created successfully!');
        this.router.navigate(["/admin-owners"]);
      });
    }
  }

}
