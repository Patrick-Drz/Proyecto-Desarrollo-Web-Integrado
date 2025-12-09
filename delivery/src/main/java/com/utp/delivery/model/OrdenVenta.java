package com.utp.delivery.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; 
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.ToString;
import lombok.EqualsAndHashCode;

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
    private BigDecimal igv; 
    private String estado;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne(fetch = FetchType.EAGER) 
    @JoinColumn(name = "id_usuario", nullable = false)

    @JsonIgnoreProperties({"ordenesVenta", "password", "hibernateLazyInitializer", "handler"}) 
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_direccion_entrega", nullable = false)
    private Direccion direccionEntrega;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "ordenVenta", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<DetalleOrdenVenta> detalles;
}