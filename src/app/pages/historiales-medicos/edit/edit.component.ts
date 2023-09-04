import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HistorialesMedicosService } from '../historiales-medicos.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class HistorialesMedicosEditComponent implements OnInit {
  historialMedico: any;

  formAPPatologicos: FormGroup = this.formBuilder.group({

  });

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private historialesMedicosService: HistorialesMedicosService
  ) {}

  ngOnInit() {
    const historialMedicoId = +this.route.snapshot.paramMap.get('HistorialMedico')!;
    this.historialesMedicosService.getHistorialMedico(historialMedicoId)
      .subscribe(historialMedico => {
        console.table(historialMedico)
        this.historialMedico = historialMedico;
      });
  }

  guardar(){
    
  }
}
