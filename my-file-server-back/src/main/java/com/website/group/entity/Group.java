package com.website.group.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "groups")
@AllArgsConstructor
@NoArgsConstructor
@Getter@Setter
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "group_code")
    private Long groupCode;
    @Column(name = "name")
    private String name;
    @Column(name = "create_at")
    private LocalDate createAt;
    public Group(String name, LocalDate createAt) {
        this.name = name;
        this.createAt = createAt;
    }
}
