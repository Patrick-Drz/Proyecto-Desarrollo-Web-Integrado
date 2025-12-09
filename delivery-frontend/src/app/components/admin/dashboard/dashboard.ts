import { Component, OnInit } from '@angular/core';
import { OrderService, Orden } from '../../../core/services/order';
import { ProductService } from '../../../core/services/product';
import { OfferService } from '../../../core/services/offer';
import { ComplaintService, Reclamacion } from '../../../core/services/complaint';
import { ChartConfiguration, ChartOptions, ChartData } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  standalone: false
})
export class Dashboard implements OnInit {
  
  currentDate = new Date();
  
  totalVentas: number = 0;
  cantidadPedidos: number = 0;
  cantidadProductos: number = 0;
  cantidadOfertas: number = 0;
  cantidadReclamaciones: number = 0;
  
  ultimosPedidos: Orden[] = [];
  productosBajoStock: any[] = [];


  public salesChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Ingresos (S/)',
        backgroundColor: '#4e73df',
        hoverBackgroundColor: '#2e59d9',
        barPercentage: 0.6,
        categoryPercentage: 0.8,
        yAxisID: 'y',
      },
      {
        data: [],
        label: 'Cant. Pedidos',
        backgroundColor: '#1cc88a',
        hoverBackgroundColor: '#17a673',
        barPercentage: 0.6,
        categoryPercentage: 0.8,
        yAxisID: 'y1',
      }
    ]
  };

  public salesChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        backgroundColor: 'rgb(255,255,255)',
        bodyColor: '#858796',
        titleColor: '#6e707e',
        borderColor: '#dddfeb',
        borderWidth: 1,
        padding: 10,
        displayColors: true
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#858796' } },
      y: { 
        type: 'linear', display: true, position: 'left', 
        title: { display: true, text: 'Monto (S/)' },
        grid: { color: '#eaecf4', drawTicks: false },
        ticks: { color: '#858796', callback: (val) => 'S/ ' + val }
      },
      y1: { 
        type: 'linear', display: true, position: 'right', 
        title: { display: true, text: 'N° Pedidos' },
        grid: { drawOnChartArea: false },
        ticks: { color: '#858796', stepSize: 1 }
      }
    }
  };

  public complaintsChartData: ChartData<'bar'> = {
    labels: [], 
    datasets: [{
      data: [],
      label: 'Cantidad',
      backgroundColor: ['#e74a3b', '#f6c23e', '#36b9cc', '#1cc88a'], 
      borderRadius: 5,
      barPercentage: 0.6
    }]
  };
  
  public complaintsChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { 
        beginAtZero: true, 
        ticks: { stepSize: 1 }, 
        grid: { color: '#eaecf4', drawTicks: false } 
      },
      x: { grid: { display: false } }
    },
    plugins: {
      legend: { display: false }
    }
  };


  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { 
        data: [], 
        label: 'Unidades', 
        backgroundColor: '#36b9cc', 
        borderRadius: 4,
        barPercentage: 0.7 
      }
    ]
  };
  
  public barChartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: { 
        x: { grid: { display: false }, ticks: { stepSize: 1 } },
        y: { grid: { display: false } } 
    },
    plugins: { legend: { display: false } }
  };

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private offerService: OfferService,
    private complaintService: ComplaintService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.productService.obtenerProductos().subscribe(p => {
      this.cantidadProductos = p.length;
      this.productosBajoStock = p.filter(prod => prod.stock < 5);
    });

    this.offerService.obtenerOfertas().subscribe(o => {
      this.cantidadOfertas = o.filter(off => off.activa).length;
    });

    this.complaintService.obtenerReclamaciones().subscribe(reclamos => {
      this.cantidadReclamaciones = reclamos.length;
      this.procesarReclamaciones(reclamos);
    });

    this.orderService.obtenerTodasLasOrdenes().subscribe(ordenes => {
      this.procesarMetricasVentas(ordenes);
      this.procesarGraficosVentas(ordenes);
    });
  }

  procesarMetricasVentas(ordenes: Orden[]) {
    this.cantidadPedidos = ordenes.length;
    this.totalVentas = ordenes
      .filter(o => o.estado !== 'CANCELADO')
      .reduce((sum, current) => sum + (current.total || 0), 0);
    this.ultimosPedidos = ordenes.sort((a, b) => b.id - a.id).slice(0, 5);
  }

  procesarGraficosVentas(ordenes: Orden[]) {
    const datosPorFecha: any = {};
    
    ordenes.forEach(orden => {
      if (orden.estado !== 'CANCELADO') {
        const fecha = orden.fechaOrden.toString().substring(0, 10);
        if (!datosPorFecha[fecha]) datosPorFecha[fecha] = { total: 0, cantidad: 0 };
        datosPorFecha[fecha].total += orden.total;
        datosPorFecha[fecha].cantidad += 1;
      }
    });

    const fechas = Object.keys(datosPorFecha).sort();
    
    this.salesChartData.labels = fechas;
    this.salesChartData.datasets[0].data = fechas.map(f => datosPorFecha[f].total);
    this.salesChartData.datasets[1].data = fechas.map(f => datosPorFecha[f].cantidad);
    
    this.salesChartData = { ...this.salesChartData };

    const conteoProd: any = {};
    ordenes.forEach(orden => {
      if (orden.estado !== 'CANCELADO') {
        orden.detalles.forEach(d => {
          const nombre = d.producto?.nombre || d.oferta?.nombreOferta || 'Item';
          conteoProd[nombre] = (conteoProd[nombre] || 0) + d.cantidad;
        });
      }
    });
    
    const top = Object.entries(conteoProd)
        .sort((a: any, b: any) => b[1] - a[1])
        .slice(0, 5);
    
    this.barChartData.labels = top.map(p => p[0]);
    this.barChartData.datasets[0].data = top.map((p: any) => p[1]);
    this.barChartData = { ...this.barChartData };
  }

  procesarReclamaciones(reclamos: Reclamacion[]) {
    const conteoTipos: any = {};

    reclamos.forEach(r => {
      const tipo = r.tipoReclamacion ? r.tipoReclamacion.toUpperCase() : 'SIN TIPO';
      conteoTipos[tipo] = (conteoTipos[tipo] || 0) + 1;
    });

    const etiquetas = Object.keys(conteoTipos);
    const valores = etiquetas.map(t => conteoTipos[t]);

    this.complaintsChartData.labels = etiquetas;
    this.complaintsChartData.datasets[0].data = valores;
    
    this.complaintsChartData = { ...this.complaintsChartData };
  }
}