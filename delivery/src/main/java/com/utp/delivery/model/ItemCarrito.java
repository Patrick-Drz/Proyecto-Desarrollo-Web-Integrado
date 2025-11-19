package com.utp.delivery.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "items_carrito")
public class ItemCarrito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_carrito")
    @JsonBackReference("carrito-item")
    private Carrito carrito;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = true) 
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "id_oferta", nullable = true) 
    private Oferta oferta;

    private int cantidad;
    private BigDecimal precioUnitarioAlMomento;
}