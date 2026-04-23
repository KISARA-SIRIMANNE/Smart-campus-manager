package com.smartcampus.backend.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;

@Document(collection = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    private String id;

    private String userId;
    private String resourceId;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    private String purpose;
    private String status;
}