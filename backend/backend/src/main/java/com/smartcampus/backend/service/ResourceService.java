package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Resource;
import com.smartcampus.backend.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    // Create
    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    // Get All
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    // Get By ID
    public Resource getResourceById(String id) {
        return resourceRepository.findById(id).orElse(null);
    }

    // Delete
    public void deleteResource(String id) {
        resourceRepository.deleteById(id);
    }
}