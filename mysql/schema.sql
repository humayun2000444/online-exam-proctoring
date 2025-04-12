CREATE DATABASE IF NOT EXISTS exam_db;

USE exam_db;

CREATE TABLE `users` (
                         `id` int(11) NOT NULL AUTO_INCREMENT,
                         `name` varchar(100) DEFAULT NULL,
                         `email` varchar(100) DEFAULT NULL,
                         `password` varchar(255) DEFAULT NULL,
                         `role` enum('student','teacher','admin') DEFAULT 'student',
                         `birthdate` date DEFAULT NULL,               -- For students
                         `year` varchar(10) DEFAULT NULL,             -- For students
                         `semester` varchar(20) DEFAULT NULL,         -- For students
                         `section` varchar(10) DEFAULT NULL,          -- For students
                         `student_id` varchar(20) DEFAULT NULL,       -- For students
                         `teacher_id` varchar(20) DEFAULT NULL,       -- For teachers
                         `position` varchar(50) DEFAULT NULL,         -- For teachers
                         `designation` varchar(50) DEFAULT NULL,      -- For teachers
                         PRIMARY KEY (`id`),
                         UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;


CREATE TABLE `exams` (
                         `id` int(11) NOT NULL AUTO_INCREMENT,
                         `title` varchar(255) DEFAULT NULL,
                         `description` text,
                         `date` date DEFAULT NULL,
                         `duration` int(11) DEFAULT NULL,
                         `created_by` int(11) DEFAULT NULL,
                         PRIMARY KEY (`id`),
                         KEY `created_by` (`created_by`),
                         CONSTRAINT `exams_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;


CREATE TABLE `student_exams` (
                                 `id` int(11) NOT NULL AUTO_INCREMENT,
                                 `student_id` int(11) DEFAULT NULL,
                                 `exam_id` int(11) DEFAULT NULL,
                                 `status` varchar(50) DEFAULT 'pending',
                                 PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;




CREATE TABLE IF NOT EXISTS proctoring_alerts (
                                                 id INT AUTO_INCREMENT PRIMARY KEY,
                                                 user_id INT NOT NULL,
                                                 message VARCHAR(255),
    timestamp DATETIME
    );

CREATE TABLE IF NOT EXISTS exam_submissions (
                                                id INT AUTO_INCREMENT PRIMARY KEY,
                                                user_id INT NOT NULL,
                                                exam_id INT,
                                                submission_time DATETIME,
                                                reason VARCHAR(255),
    alert_count INT DEFAULT 0
    );

CREATE TABLE proctor_alerts (
                                id INT AUTO_INCREMENT PRIMARY KEY,
                                user_id INT NOT NULL,
                                message TEXT NOT NULL,
                                timestamp DATETIME NOT NULL,
                                alert_type VARCHAR(50) NOT NULL,
                                FOREIGN KEY (user_id) REFERENCES users(id)
);
