package com.edumatch.user.service;

import com.edumatch.user.model.Employer;
import com.edumatch.user.repository.EmployerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployerService {

    private final EmployerRepository employerRepository;

    public List<Employer> getAllEmployers() {
        return employerRepository.findAll();
    }

    public Optional<Employer> getEmployerById(String id) {
        return employerRepository.findById(id);
    }

    public Employer saveEmployer(Employer employer) {
        return employerRepository.save(employer);
    }

    public void deleteEmployer(String id) {
        employerRepository.deleteById(id);
    }
}
