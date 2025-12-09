package com.utp.delivery.controller;

import com.utp.delivery.model.Usuario;
import com.utp.delivery.service.AdminUsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AdminUsuarioController {

    private final AdminUsuarioService adminUsuarioService;

    @GetMapping
    public ResponseEntity<List<Usuario>> listar() {
        return ResponseEntity.ok(adminUsuarioService.listarTodos());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> estadisticas() {
        return ResponseEntity.ok(adminUsuarioService.obtenerEstadisticas());
    }

    @PostMapping
    public ResponseEntity<Usuario> crear(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(adminUsuarioService.crearUsuario(usuario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(@PathVariable Long id, @RequestBody Usuario usuario) {
        return ResponseEntity.ok(adminUsuarioService.actualizarUsuario(id, usuario));
    }

    @PutMapping("/{id}/bloqueo")
    public ResponseEntity<Usuario> bloquearDesbloquear(@PathVariable Long id) {
        return ResponseEntity.ok(adminUsuarioService.cambiarEstadoBloqueo(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        adminUsuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}