package com.example.curso.service.impl;

import org.springframework.stereotype.Service;

import com.example.curso.entity.Curso;
import com.example.curso.repository.CursoRepository;
import com.example.curso.service.CursoService;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

@Service
public class CursoServiceImpl implements CursoService {
    @Autowired
    private CursoRepository cursoRepository;

    @Override
    public List<Curso> listar() {
        return cursoRepository.findAll();
    }

    @Override
    public Curso guardar(Curso curso) {
        return cursoRepository.save(curso);
    }

    @Override
    public Curso actualizar(Curso curso) {
        return cursoRepository.save(curso);
    }

    @Override
    public Optional<Curso> listarPorId(Integer id) {
        return cursoRepository.findById(id);
    }

    @Override
    public void eliminarPorId(Integer id) {
        cursoRepository.deleteById(id);
    }
}
