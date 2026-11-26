import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DashboardService, DashboardStats } from '../../../core/services/dashboard/dashboard.service';
import ApexCharts, { ApexOptions } from 'apexcharts';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [CurrencyPipe],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  
  stats: DashboardStats | null = null;
  isLoading = true;

 ngOnInit() {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
        
        setTimeout(() => {
          this.initChart(data.last7DaysSales);
        }, 100);
      },
      error: (err) => {
        console.error('Error cargando estadísticas', err);
        this.isLoading = false;
      }
    });
  }

initChart(salesData: { date: string; total: number }[]) {
    const chartOptions: ApexOptions = {
      series: [{
        name: "Ventas (COP)",
        data: salesData.map(s => s.total)
      }],
      chart: { type: "bar", height: 350, toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
      colors: ["#2563eb"], // Color azul
      plotOptions: {
        bar: { borderRadius: 6, columnWidth: "45%", dataLabels: { position: "top" } }
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => val > 0 ? '$' + val.toLocaleString('es-CO') : '',
        offsetY: -20,
        style: { fontSize: "10px", colors: ["#64748b"] }
      },
      xaxis: {
        categories: salesData.map(s => s.date),
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: '#94a3b8' } }
      },
      yaxis: {
        labels: { formatter: (val: number) => '$' + val.toLocaleString('es-CO') }
      },
      grid: {
        borderColor: '#f1f5f9',
        strokeDashArray: 4,
      }
    };

    // Buscamos el div en el HTML y le inyectamos el gráfico
   const chartElement = document.querySelector("#salesChart") as HTMLElement;
    
    if (chartElement) {
      const chart = new ApexCharts(chartElement, chartOptions);
      chart.render();
    }
  }
}