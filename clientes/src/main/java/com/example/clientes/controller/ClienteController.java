package com.example.clientes.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.clientes.entity.Cliente;
import com.example.clientes.service.ClienteService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/cliente")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @GetMapping()
    public ResponseEntity<List<Cliente>> list() {
        return ResponseEntity.ok().body(clienteService.listar());
    }

    @PostMapping()
    public ResponseEntity<Cliente> save(@RequestBody Cliente cliente) {
        return ResponseEntity.ok(clienteService.guardar(cliente));
    }

    @PutMapping()
    public ResponseEntity<Cliente> update(@RequestBody Cliente cliente) {
        return ResponseEntity.ok(clienteService.actualizar(cliente));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> listById(@PathVariable(required = true) Integer id) {
        return ResponseEntity.ok().body(clienteService.listarPorId(id).get());
    }

    @DeleteMapping("/{id}")
    public String deleteById(@PathVariable(required = true) Integer id) {
        clienteService.eliminarPorId(id);
        return "Eliminacion Correcta";
    }
}
