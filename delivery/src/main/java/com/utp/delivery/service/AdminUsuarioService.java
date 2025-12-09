package com.utp.delivery.service;

import com.utp.delivery.model.Usuario;
import com.utp.delivery.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AdminUsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario crearUsuario(Usuario usuario) {
        if (usuarioRepository.findByCorreo(usuario.getCorreo()).isPresent()) {
            throw new RuntimeException("El correo ya está registrado");
        }
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        usuario.setFechaRegistro(LocalDateTime.now());
        usuario.setActivo(true);
        return usuarioRepository.save(usuario);
    }

    public Usuario actualizarUsuario(Long id, Usuario detalles) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setNombreCompleto(detalles.getNombreCompleto());
        usuario.setRol(detalles.getRol());
        usuario.setCodigoEstudiante(detalles.getCodigoEstudiante());

        if (detalles.getContrasena() != null && !detalles.getContrasena().isEmpty()) {
            usuario.setContrasena(passwordEncoder.encode(detalles.getContrasena()));
        }

        return usuarioRepository.save(usuario);
    }

    public Usuario cambiarEstadoBloqueo(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setActivo(!usuario.isActivo());
        return usuarioRepository.save(usuario);
    }

    public void eliminarUsuario(Long id) {
        usuarioRepository.deleteById(id);
    }

    // Métricas para el Dashboard de Usuarios

    public Map<String, Object> obtenerEstadisticas() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        Map<String, Object> stats = new HashMap<>();

        stats.put("total", usuarios.size());
        stats.put("activos", usuarios.stream().filter(Usuario::isActivo).count());
        stats.put("inactivos", usuarios.stream().filter(u -> !u.isActivo()).count());
        stats.put("admin", usuarios.stream().filter(u -> "ADMINISTRADOR".equals(u.getRol())).count());
        stats.put("clientes", usuarios.stream().filter(u -> "CLIENTE".equals(u.getRol())).count());

        return stats;
    }
}