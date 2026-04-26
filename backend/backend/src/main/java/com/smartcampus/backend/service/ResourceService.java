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

    // Update
    public Resource updateResource(String id, Resource updatedResource) {
        Resource resource = resourceRepository.findById(id).orElse(null);
        if (resource != null) {
            if (updatedResource.getName() != null) {
                resource.setName(updatedResource.getName());
            }
            if (updatedResource.getCategory() != null) {
                resource.setCategory(updatedResource.getCategory());
            }
            if (updatedResource.getCapacity() != null) {
                resource.setCapacity(updatedResource.getCapacity());
            }
            if (updatedResource.getLocation() != null) {
                resource.setLocation(updatedResource.getLocation());
            }
            if (updatedResource.getDescription() != null) {
                resource.setDescription(updatedResource.getDescription());
            }
            if (updatedResource.getAvailabilityStatus() != null) {
                resource.setAvailabilityStatus(updatedResource.getAvailabilityStatus());
            }
            return resourceRepository.save(resource);
        }
        return null;
    }

    // Bulk fix resources without category
    public long fixResourcesWithoutCategory(String defaultCategory) {
        List<Resource> resourcesWithoutCategory = resourceRepository.findAll()
            .stream()
            .filter(r -> r.getCategory() == null || r.getCategory().trim().isEmpty())
            .toList();

        resourcesWithoutCategory.forEach(resource -> {
            resource.setCategory(defaultCategory);
            resourceRepository.save(resource);
        });

        return resourcesWithoutCategory.size();
    }
}