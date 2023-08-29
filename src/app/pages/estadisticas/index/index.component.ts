import { Component } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class EstadisticasIndexComponent {
  public pieChartLabels: string[] = ['Red', 'Green', 'Blue'];
  public pieChartData: number[] = [300, 500, 100];
  public pieChartType = 'pie';
  
  constructor() {}

  ngOnInit(): void {}

}
