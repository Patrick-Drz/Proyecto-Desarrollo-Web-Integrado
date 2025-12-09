package com.utp.delivery.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Data
@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nombreCompleto;
    
    @Column(unique = true)
    private String correo;
    
    @JsonIgnore
    private String contrasena;
    
    private String rol;
    private String codigoEstudiante;
    private LocalDateTime fechaRegistro;
    private boolean activo;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "usuario")
    @JsonIgnore 
    private List<OrdenVenta> ordenesVenta = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
        name = "usuario_direcciones", 
        joinColumns = @JoinColumn(name = "id_usuario"), 
        inverseJoinColumns = @JoinColumn(name = "id_direccion")
    )
    private List<Direccion> direcciones = new ArrayList<>();

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() { 
        return List.of(new SimpleGrantedAuthority(rol)); 
    }
    @Override
    public String getPassword() { return this.contrasena; }
    @Override
    public String getUsername() { return this.correo; }
    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() { return true; }
    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() { return true; }
    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    @JsonIgnore
    public boolean isEnabled() { return this.activo; }
}