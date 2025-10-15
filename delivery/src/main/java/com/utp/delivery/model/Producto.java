package com.utp.delivery.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Entity
@Table(name = "productos")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String codigoProducto;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private int stock;
    private String rutaImagen;

    @OneToMany(mappedBy = "productoPadre")
    private List<ComboProducto> componentesCombo;
}