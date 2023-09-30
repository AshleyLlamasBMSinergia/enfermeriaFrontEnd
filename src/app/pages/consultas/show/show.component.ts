import { Component } from '@angular/core';
import { ConsultasService } from '../consultas.service';
import { ActivatedRoute } from '@angular/router';
import { Consultas } from 'src/app/interfaces/consultas';
import { ImageService } from 'src/app/services/imagen.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ConsultasShowComponent {
  consulta!: Consultas | null;
  terminado: boolean = false;
  image: any;

  constructor(
    private imageService: ImageService,
    private consultasService: ConsultasService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.getConsulta();
  }

  getConsulta() {
    const consultaId = +this.route.snapshot.paramMap.get('Consulta')!;
    this.consultasService.getConsulta(consultaId)
      .subscribe(consulta => {
        this.consulta = consulta;
        this.terminado = true;
      }
    );
  }

  toRoman(num: number | undefined): string {
    const romanNumerals = ["I", "II", "III", "IV", "V"];
    if (num !== undefined && num >= 1 && num <= 5) {
      return romanNumerals[num - 1];
    } else {
      return "-";
    }
  }
}
