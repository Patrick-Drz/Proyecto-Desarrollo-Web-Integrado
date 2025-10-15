package com.utp.delivery.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import lombok.EqualsAndHashCode;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Data
@Entity
@Table(name = "combo_productos")
public class ComboProducto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne
    @JsonBackReference("combo-componente")
    @JoinColumn(name = "id_producto_padre")
    private Producto productoPadre;
    @ManyToOne
    @JoinColumn(name = "id_producto_hijo")
    private Producto productoHijo;
    private int cantidad;
}
