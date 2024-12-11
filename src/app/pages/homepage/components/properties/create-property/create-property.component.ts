import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertyService } from '../../../../../shared/services/property.service';
import { Router } from '@angular/router';
import { PropertyType } from '../../../../../shared/enumeration/property-type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-property',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-property.component.html',
  styleUrl: './create-property.component.scss'
})
export class CreatePropertyComponent implements OnInit{

  propertyForm! : FormGroup;
  propertyTypes = Object.values(PropertyType);

  constructor(private propertyService: PropertyService, private router : Router){}

  ngOnInit(): void {
    this.propertyForm = new FormGroup({
      numberE9: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
      yearOfConstruction: new FormControl (""),
      propertyType: new FormControl (""),
      propertyOwner: new FormGroup({
        id: new FormControl("", Validators.required)
      })
    });
  }

  onSubmit(){
    if (this.propertyForm.valid) {
      const formValue = {
        ...this.propertyForm.value,
        propertyOwner: {
          id: this.propertyForm.get('propertyOwner.id')?.value,
        },
      };
      this.propertyService.postProperty(formValue).subscribe(() =>{
        this.router.navigate([""]);
      })
    }
  }

}
