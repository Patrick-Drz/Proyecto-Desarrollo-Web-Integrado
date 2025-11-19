package com.utp.delivery.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import lombok.ToString;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "detalles_orden_venta")
public class DetalleOrdenVenta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne
    @JoinColumn(name = "id_orden_venta")
    @JsonBackReference("orden-detalle")
    private OrdenVenta ordenVenta;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = true) 
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "id_oferta", nullable = true)
    private Oferta oferta;

    private int cantidad;
    private BigDecimal precioUnitarioAlMomento;
}