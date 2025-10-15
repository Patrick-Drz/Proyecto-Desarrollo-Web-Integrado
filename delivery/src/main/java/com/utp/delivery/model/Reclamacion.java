package com.utp.delivery.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reclamaciones")
public class Reclamacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_orden_venta")
    private OrdenVenta ordenVenta;

    private String tipoReclamacion;
    private String descripcion;
    private LocalDateTime fechaCreacion;
    private String estado;
}