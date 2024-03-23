import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {  Observable, switchMap } from 'rxjs';
import { API_URL } from 'src/app/config';
import { Router } from '@angular/router';
import { AntecedentesPersonalesPatologicos } from 'src/app/interfaces/antecedentes-personales-patologicos';
import { AntecedentesPersonalesNoPatologicos } from 'src/app/interfaces/antecedentes-personales-no-patologicos';
import { AntecedentesHeredofamiliares } from 'src/app/interfaces/antecedentes-heredofamiliares';
import { Examenes } from 'src/app/interfaces/examenes';
import { Dependientes } from 'src/app/interfaces/dependientes';
import { HistorialesMedicos } from 'src/app/interfaces/historiales-medicos';

@Injectable({
  providedIn: 'root'
})
export class HistorialesMedicosService {
  
  httpOptions = {
     headers: new HttpHeaders({
       'Content-Type': 'application/json'
     })
  }

  constructor( private httpClient: HttpClient, private router: Router ) { }

  pacientable(historialesMedicos: HistorialesMedicos): HistorialesMedicos {
    historialesMedicos.pacientable = historialesMedicos.pacientable;
    return historialesMedicos;
  }

  buscador(nombre: string): Observable<any[]> {
    const url = `${API_URL}historiales-medicos/buscador?nombre=${nombre}`;
    return this.httpClient.get<any[]>(url);
  }

  buscarHistorialMedicoCAN (numero: number): Observable<any[]> {
    return this.httpClient.get<any[]>(API_URL+"can/empleados/"+numero);
  }

  buscarHistorialMedico(cediId:number, numeroEmpleado:number){
    return this.httpClient.get<any[]>(API_URL+"cedis/"+cediId+"/empleados/"+numeroEmpleado);
  }

  getHistorialesMedicos (): Observable<HistorialesMedicos[]> {
    return this.httpClient.get<HistorialesMedicos[]>(API_URL+"historiales-medicos");
  }

  getDependientesDelEmpleado(empleadoId: number):Observable<Dependientes[]> {
    return this.httpClient.get<Dependientes[]>(API_URL+"dependientes/"+empleadoId);
  }

  getHistorialMedico(id: number): Observable<HistorialesMedicos> {
    return this.httpClient.get<HistorialesMedicos>(`${API_URL+"historiales-medicos"}/${id}`);
  }

  getPDF(recetaId: number, fecha: Date): Observable<Blob> {
    return this.httpClient.get(API_URL + "historial-medico/pdf/" + recetaId + '/' + fecha, { responseType: 'blob' });
  }

  storeHistorialMedico(historialMedico: any, imagen: any): Observable<HistorialesMedicos> {
    if (imagen) {
      return this.procesarImagen(imagen).pipe(
        switchMap(imagenBase64 => {
          historialMedico.imagen = imagenBase64;
          return this.enviarHistorialMedico(historialMedico);
        })
      );
    } else {
      return this.enviarHistorialMedico(historialMedico);
    }
  }
  
  private enviarHistorialMedico(historialMedico: any): Observable<HistorialesMedicos> {
    return this.httpClient.post<HistorialesMedicos>(
      API_URL + "historiales-medicos",
      historialMedico,
      this.httpOptions
    );
  }
  
  private procesarImagen(imagen: File): Observable<string> {
    return new Observable<string>((observer) => {
      const reader = new FileReader();
      reader.readAsDataURL(imagen);
  
      reader.onload = (event) => {
        const imagenBase64 = (event.target as FileReader).result as string;
        observer.next(imagenBase64);
        observer.complete();
      };
    });
  }
  
  updateHistorialMedico(id: number, historialMedico: any, imagen?: File): Observable<HistorialesMedicos> {
    return new Observable<HistorialesMedicos>((observer) => {
      const processImage = () => {
        if (imagen) {
          const reader = new FileReader();
          reader.readAsDataURL(imagen);
  
          reader.onload = (event) => {
            const imagenBase64 = (event.target as FileReader).result as string;
            historialMedico.imagen = imagenBase64;
            sendRequest();
          };
        } else {
          sendRequest();
        }
      };
  
      const sendRequest = () => {
        const url = `${API_URL}historiales-medicos/edit/${id}`;
  
        this.httpClient.put<HistorialesMedicos>(url, historialMedico, this.httpOptions)
          .subscribe(
            (response) => {
              observer.next(response);
              observer.complete();
            },
            (error) => {
              observer.error(error);
            }
          );
      };
  
      processImage();
    });
  }
  

  destroyHistorialMedico(historialMedico: number): Observable<any> {
    const url = `${API_URL}historiales-medicos/${historialMedico}`;
    return this.httpClient.delete(url);
  }

  storeDependientes(dependiente: any, imagen: File): Observable<Dependientes> {
    if (imagen) {
      return this.procesarImagen(imagen).pipe(
        switchMap(imagenBase64 => {
          dependiente.imagen = imagenBase64;
          return this.enviarDependiente(dependiente);
        })
      );
    } else {
      return this.enviarDependiente(dependiente);
    }
  }

  updateDependiente(id: number, dependiente: any, imagen: File): Observable<Dependientes> {
    if (imagen) {
      return this.procesarImagen(imagen).pipe(
        switchMap(imagenBase64 => {
          dependiente.imagen = imagenBase64;
          return this.enviarEditarDependiente(id, dependiente);
        })
      );
    } else {
      return this.enviarEditarDependiente(id, dependiente);
    }
  }
  
  private enviarEditarDependiente(id: number, dependiente: any): Observable<Dependientes> {
    const url = `${API_URL}dependientes/edit/${id}`;
    return this.httpClient.put<Dependientes>(url, dependiente, this.httpOptions);
  }

  private enviarDependiente(dependiente: any): Observable<Dependientes> {
    return this.httpClient.post<Dependientes>(API_URL + "dependientes", dependiente, this.httpOptions);
  }

  storeAntecedentespersonalesPatologicos(antecedentesPersonalesPatologicos: any): Observable<AntecedentesPersonalesPatologicos> {
    return this.httpClient.post<AntecedentesPersonalesPatologicos>(API_URL+"antecendentes-personales-patologicos", JSON.stringify(antecedentesPersonalesPatologicos), this.httpOptions);
  }

  updateAntecedentespersonalesPatologicos(
    APPatologicoId: number,
    antecedentesPersonalesPatologicos: any
  ): Observable<AntecedentesPersonalesPatologicos> {
    const url = `${API_URL}antecendentes-personales-patologicos/edit/${APPatologicoId}`;
  
    return this.httpClient.put<AntecedentesPersonalesPatologicos>(
      url,
      JSON.stringify(antecedentesPersonalesPatologicos),
      this.httpOptions
    );
  }

  storeAntecedentespersonalesNoPatologicos(antecedentesPersonalesNoPatologicos: any): Observable<AntecedentesPersonalesNoPatologicos> {
    return this.httpClient.post<AntecedentesPersonalesNoPatologicos>(API_URL+"antecendentes-personales-no-patologicos", JSON.stringify(antecedentesPersonalesNoPatologicos), this.httpOptions);
  }

  updateAntecedentespersonalesNoPatologicos(
    APNPatologicoId: number,
    antecedentesPersonalesNoPatologicos: any
  ): Observable<AntecedentesPersonalesNoPatologicos> {
    const url = `${API_URL}antecendentes-personales-no-patologicos/edit/${APNPatologicoId}`;
  
    return this.httpClient.put<AntecedentesPersonalesNoPatologicos>(
      url,
      JSON.stringify(antecedentesPersonalesNoPatologicos),
      this.httpOptions
    );
  }

  storeAntecedentesHeredofamiliares(antecedentesHeredofamiliares: any): Observable<AntecedentesHeredofamiliares> {
    return this.httpClient.post<AntecedentesHeredofamiliares>(API_URL+"antecendentes-heredofamiliares", JSON.stringify(antecedentesHeredofamiliares), this.httpOptions);
  }

  updateAntecedentesHeredofamiliares(
    APNPatologicoId: number,
    antecedentesHeredofamiliares: any
  ): Observable<AntecedentesHeredofamiliares> {
    const url = `${API_URL}antecendentes-heredofamiliares/edit/${APNPatologicoId}`;
  
    return this.httpClient.put<AntecedentesHeredofamiliares>(
      url,
      JSON.stringify(antecedentesHeredofamiliares),
      this.httpOptions
    );
  }

  storeExamenesFisicos(examenesFisicos: any): Observable<any> {
    return this.httpClient.post<any>(API_URL+"examenes-fisicos", JSON.stringify(examenesFisicos), this.httpOptions);
  }

  destroyEFisico(EFisicoId: number): Observable<any> {
    const url = `${API_URL}examenes-fisicos/${EFisicoId}`;
    return this.httpClient.delete(url);
  }

  storeExamenAntidoping(examenAntidoping: any): Observable<any> {
    return this.httpClient.post<any>(API_URL+"examen-antidoping", JSON.stringify(examenAntidoping), this.httpOptions);
  }

  destroyEAntidoping(EAntidopingId: number): Observable<any> {
    const url = `${API_URL}examen-antidoping/${EAntidopingId}`;
    return this.httpClient.delete(url);
  }

  storeExamenEmbarazo(examenEmbarazo: any): Observable<any> {
    return this.httpClient.post<any>(API_URL+"examen-embarazo", JSON.stringify(examenEmbarazo), this.httpOptions);
  }

  destroyEEmbarazo(EEmbarazoId: number): Observable<any> {
    const url = `${API_URL}examen-embarazo/${EEmbarazoId}`;
    return this.httpClient.delete(url);
  }

  storeExamenVista(examenVista: any): Observable<any> {
    return this.httpClient.post<any>(API_URL+"examen-vista", JSON.stringify(examenVista), this.httpOptions);
  }

  destroyEVista(EVistaId: number): Observable<any> {
    const url = `${API_URL}examen-vista/${EVistaId}`;
    return this.httpClient.delete(url);
  }

  storeArchivo(examen: any): Observable<Examenes> {
    return this.httpClient.post<Examenes>(API_URL+"examen", JSON.stringify(examen), this.httpOptions);
  }

  storeArchivos(examen: any): Observable<Examenes> {
    return this.httpClient.post<Examenes>(API_URL+"examen", JSON.stringify(examen), this.httpOptions);
  }

  destroyExamen(ExamenId: number): Observable<any> {
    const url = `${API_URL}examen/${ExamenId}`;
    return this.httpClient.delete(url);
  }
  getDependientes(): Observable<any> {
    return this.httpClient.get<Dependientes[]>(`${API_URL}dependientes`);
  }

  getHistorialMedicoPorPaciente(pacienteType: string, pacienteId: number):Observable<any>{
    return this.httpClient.get<HistorialesMedicos>(API_URL+"historiales-medicos/"+pacienteType+"/"+pacienteId);
  }

  //ESTADISTICAS
  getEstadisticaPacientesConMasConsultas(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${API_URL}estadisticas/historiales-medicos/pacientes-con-mas-consultas`);
  }
}
