package com.utp.delivery.service;

import com.utp.delivery.dto.CrearReclamacionRequest;
import com.utp.delivery.model.Reclamacion;
import com.utp.delivery.model.Usuario;
import com.utp.delivery.repository.ReclamacionRepository;
import com.utp.delivery.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReclamacionService {
    private final ReclamacionRepository reclamacionRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public Reclamacion crearReclamacion(Long idUsuario, CrearReclamacionRequest request) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        Reclamacion reclamacion = new Reclamacion();
        reclamacion.setUsuario(usuario);
        reclamacion.setTipoReclamacion(request.getTipoReclamacion());
        reclamacion.setDescripcion(request.getDescripcion());
        reclamacion.setFechaCreacion(LocalDateTime.now());
        reclamacion.setEstado("ABIERTO");

        return reclamacionRepository.save(reclamacion);
    }

    @Transactional(readOnly = true)
    public List<Reclamacion> obtenerTodas() {
        return reclamacionRepository.findAll();
    }
}
