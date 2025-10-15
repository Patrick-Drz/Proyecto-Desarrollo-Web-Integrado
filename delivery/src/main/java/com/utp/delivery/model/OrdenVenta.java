package com.utp.delivery.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Data
@Entity
@Table(name = "ordenes_venta")
public class OrdenVenta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_orden")
    private LocalDateTime fechaOrden;

    private BigDecimal total;
    private String estado;

    // Relación con Usuario
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonBackReference // Lado "hijo": No se serializará para evitar el bucle
    private Usuario usuario;

    // Relación con Dirección de entrega
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_direccion_entrega", nullable = false)
    private Direccion direccionEntrega;

    // Relación con Detalles de la Orden
    @OneToMany(mappedBy = "ordenVenta", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<DetalleOrdenVenta> detalles;
}