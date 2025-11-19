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
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_orden_venta", nullable = true)
    private OrdenVenta ordenVenta;

    private String tipoReclamacion;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    private LocalDateTime fechaCreacion;
    private String estado; 
}