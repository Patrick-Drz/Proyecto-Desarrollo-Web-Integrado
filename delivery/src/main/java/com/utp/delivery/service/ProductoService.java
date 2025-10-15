package com.utp.delivery.service;

import com.utp.delivery.model.Producto;
import com.utp.delivery.repository.ProductoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ProductoService {
    @Autowired private ProductoRepository productoRepository;

    @Transactional(readOnly = true)
    public List<Producto> obtenerTodos() { return productoRepository.findAll(); }
    @Transactional(readOnly = true)
    public Producto obtenerPorId(Long id) {
        return productoRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con ID: " + id));
    }
    @Transactional
    public Producto crear(Producto producto) { return productoRepository.save(producto); }
    @Transactional
    public Producto actualizar(Long id, Producto productoDetalles) {
        Producto producto = obtenerPorId(id);
        producto.setNombre(productoDetalles.getNombre());
        producto.setDescripcion(productoDetalles.getDescripcion());
        producto.setPrecio(productoDetalles.getPrecio());
        producto.setStock(productoDetalles.getStock());
        producto.setRutaImagen(productoDetalles.getRutaImagen());
        return productoRepository.save(producto);
    }
    @Transactional
    public void eliminar(Long id) {
        Producto producto = obtenerPorId(id);
        productoRepository.delete(producto);
    }
}