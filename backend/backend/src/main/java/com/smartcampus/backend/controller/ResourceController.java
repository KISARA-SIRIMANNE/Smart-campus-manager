package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.Resource;
import com.smartcampus.backend.service.ResourceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    // Create Resource
    @PostMapping
    public Resource create(@RequestBody Resource resource) {
        return resourceService.createResource(resource);
    }

    // Get All Resources
    @GetMapping
    public List<Resource> getAll() {
        return resourceService.getAllResources();
    }

    // Get Resource by ID
    @GetMapping("/{id}")
    public Resource getById(@PathVariable String id) {
        return resourceService.getResourceById(id);
    }

    // Delete Resource
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        resourceService.deleteResource(id);
    }
}