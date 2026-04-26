package ies.elrincon.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ies.elrincon.backend.models.Element;
import ies.elrincon.backend.repositories.ElementRepository;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/elements")
public class ElementController {

    @Autowired
    private ElementRepository elementRepository;

    @GetMapping
    public List<Element> getAllElements() {
        return elementRepository.findAll();
    }
}
