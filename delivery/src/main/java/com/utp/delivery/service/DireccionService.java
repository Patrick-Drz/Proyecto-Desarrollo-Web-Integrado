package com.utp.delivery.service;

import com.utp.delivery.model.Direccion;
import com.utp.delivery.model.Usuario;
import com.utp.delivery.repository.DireccionRepository;
import com.utp.delivery.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DireccionService {
    private final DireccionRepository direccionRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public Direccion agregarDireccionAUsuario(Long idUsuario, Direccion direccion) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
        
        Direccion nuevaDireccion = direccionRepository.save(direccion);
        
        if (usuario.getDirecciones() == null) {
            usuario.setDirecciones(new ArrayList<>());
        }
        
        usuario.getDirecciones().add(nuevaDireccion);
        usuarioRepository.save(usuario);
        
        return nuevaDireccion;
    }

    @Transactional(readOnly = true)
    public List<Direccion> obtenerDireccionesPorUsuario(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
        
        if (usuario.getDirecciones() == null) {
            return new ArrayList<>();
        }
        
        return usuario.getDirecciones();
    }
}