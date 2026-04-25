package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.Resource;
import com.smartcampus.backend.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    // Create Resource
    @PostMapping
    public Resource create(@Valid @RequestBody Resource resource) {
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

    // Update Resource
    @PutMapping("/{id}")
    public Resource update(@PathVariable String id, @Valid @RequestBody Resource resource) {
        return resourceService.updateResource(id, resource);
    }

    // Bulk fix resources without category
    @PostMapping("/fix/missingCategory")
    public Map<String, Object> fixMissingCategories(@RequestParam(defaultValue = "Other") String category) {
        long fixed = resourceService.fixResourcesWithoutCategory(category);
        return Map.of(
            "message", "Fixed resources without category",
            "resourcesFixed", fixed,
            "category", category
        );
    }
}