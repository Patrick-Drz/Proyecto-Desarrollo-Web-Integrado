package com.utp.delivery.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "combo_productos")
public class ComboProducto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "id_producto_padre")
    private Producto productoPadre;
    @ManyToOne
    @JoinColumn(name = "id_producto_hijo")
    private Producto productoHijo;
    private int cantidad;
}
