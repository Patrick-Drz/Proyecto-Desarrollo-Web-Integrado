package com.utp.delivery.service;

import com.utp.delivery.dto.AddItemRequest;
import com.utp.delivery.model.*;
import com.utp.delivery.repository.CarritoRepository;
import com.utp.delivery.repository.ProductoRepository;
import com.utp.delivery.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CarritoService {
    private final CarritoRepository carritoRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public Carrito agregarItemACarrito(Long idUsuario, AddItemRequest itemRequest) {
        Carrito carrito = obtenerOCrearCarrito(idUsuario);
        Producto producto = productoRepository.findById(itemRequest.getIdProducto())
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado"));
        
        Optional<ItemCarrito> itemExistente = carrito.getItems().stream()
                .filter(item -> item.getProducto().getId().equals(producto.getId()))
                .findFirst();

        if (itemExistente.isPresent()) {
            ItemCarrito item = itemExistente.get();
            item.setCantidad(item.getCantidad() + itemRequest.getCantidad());
        } else {
            ItemCarrito nuevoItem = new ItemCarrito();
            nuevoItem.setCarrito(carrito);
            nuevoItem.setProducto(producto);
            nuevoItem.setCantidad(itemRequest.getCantidad());
            nuevoItem.setPrecioUnitarioAlMomento(producto.getPrecio());
            carrito.getItems().add(nuevoItem);
        }
        carrito.setFechaActualizacion(LocalDateTime.now());
        return carritoRepository.save(carrito);
    }

    // CORRECCIÓN: Se eliminó (readOnly = true) porque este método puede crear un carrito nuevo
    @Transactional
    public Carrito obtenerCarritoPorUsuario(Long idUsuario) { 
        return obtenerOCrearCarrito(idUsuario); 
    }

    @Transactional
    public void limpiarCarrito(Long idUsuario) {
        Carrito carrito = carritoRepository.findByUsuarioId(idUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Carrito no encontrado"));
        carrito.getItems().clear();
        carritoRepository.save(carrito);
    }

    private Carrito obtenerOCrearCarrito(Long idUsuario) {
        return carritoRepository.findByUsuarioId(idUsuario).orElseGet(() -> {
            Carrito nuevoCarrito = new Carrito();
            Usuario usuario = usuarioRepository.findById(idUsuario)
                    .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
            
            nuevoCarrito.setUsuario(usuario);
            nuevoCarrito.setFechaCreacion(LocalDateTime.now());
            nuevoCarrito.setFechaActualizacion(LocalDateTime.now());
            return carritoRepository.save(nuevoCarrito);
        });
    }
}