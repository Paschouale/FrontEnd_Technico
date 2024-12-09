import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertyOwnerService } from '../../../../../shared/services/property-owner.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-property-owner',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './create-property-owner.component.html',
  styleUrl: './create-property-owner.component.scss'
})
export class CreatePropertyOwnerComponent implements OnInit{
  propertyOwnerForm! : FormGroup;

  constructor(private propertyOwnerService: PropertyOwnerService, private router : Router){}

  ngOnInit(): void {
    this.propertyOwnerForm = new FormGroup({
      vatNumber: new FormControl("", Validators.required),
      name: new FormControl("", Validators.required),
      surname: new FormControl ("", Validators.required),
      address: new FormControl (""),
      phoneNumber: new FormControl (""),
      email: new FormControl("",  Validators.required),
      loginUser: new FormGroup({
        username: new FormControl("", Validators.required),
        password: new FormControl("", Validators.required),
      })
    });
  }

  onSubmit(){
    if (this.propertyOwnerForm.valid) {
      const formValue = {
        ...this.propertyOwnerForm.value,
        loginUser: {
          username: this.propertyOwnerForm.get('loginUser.username')?.value,
          password: this.propertyOwnerForm.get('loginUser.password')?.value,
        },
      };
      this.propertyOwnerService.postPropertyOwner(formValue).subscribe(() =>{
        this.router.navigate([""]);
      })
    }
  }

}
