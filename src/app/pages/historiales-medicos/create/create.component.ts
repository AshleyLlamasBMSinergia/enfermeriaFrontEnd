import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class HistorialesMedicosCreateComponent {

  historialMedicoForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.historialMedicoForm = this.formBuilder.group({
      imagen: [null],
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.historialMedicoForm.get('imagen')?.setValue(file);
    console.log(event);
  }

  guardar(){

  }
}
