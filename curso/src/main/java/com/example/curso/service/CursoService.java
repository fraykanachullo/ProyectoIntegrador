package com.example.curso.service;

import java.util.List;
import java.util.Optional;

import com.example.curso.entity.Curso;

public interface CursoService {

    public List<Curso> listar();

    public Curso guardar(Curso curso);

    public Curso actualizar(Curso curso);

    public Optional<Curso> listarPorId(Integer id);

    public void eliminarPorId(Integer id);
}
