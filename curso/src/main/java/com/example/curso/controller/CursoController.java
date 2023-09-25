package com.example.curso.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.curso.entity.Curso;
import com.example.curso.service.CursoService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/curso")
public class CursoController {
    @Autowired
    private CursoService cursoService;

    @GetMapping()
    public ResponseEntity<List<Curso>> list() {
        return ResponseEntity.ok().body(cursoService.listar());
    }

    @PostMapping()
    public ResponseEntity<Curso> save(@RequestBody Curso curso) {
        return ResponseEntity.ok(cursoService.guardar(curso));
    }

    @PutMapping()
    public ResponseEntity<Curso> update(@RequestBody Curso curso) {
        return ResponseEntity.ok(cursoService.actualizar(curso));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Curso> listById(@PathVariable(required = true) Integer id) {
        return ResponseEntity.ok().body(cursoService.listarPorId(id).get());
    }

    @DeleteMapping("/{id}")
    public String deleteById(@PathVariable(required = true) Integer id) {
        cursoService.eliminarPorId(id);
        return "Eliminacion Correcta";
    }
}
