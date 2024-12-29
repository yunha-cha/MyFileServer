-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: db.seopia.online    Database: my_file_server
-- ------------------------------------------------------
-- Server version	5.5.5-10.5.26-MariaDB-0+deb11u2
CREATE DATABASE my_file_server;
USE my_file_server;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attachment`
--

DROP TABLE IF EXISTS `attachment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attachment` (
  `attachment_code` bigint(20) NOT NULL AUTO_INCREMENT,
  `forum_code` bigint(20) DEFAULT NULL,
  `changed_name` varchar(255) DEFAULT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `file_full_path` varchar(255) DEFAULT NULL,
  `download_count` int(11) DEFAULT NULL,
  `size` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`attachment_code`),
  KEY `attachment_forum_code_idx` (`forum_code`),
  CONSTRAINT `attachment_forum_code` FOREIGN KEY (`forum_code`) REFERENCES `forum` (`forum_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attachment`
--

LOCK TABLES `attachment` WRITE;
/*!40000 ALTER TABLE `attachment` DISABLE KEYS */;
/*!40000 ALTER TABLE `attachment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `comment_code` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_code` bigint(20) DEFAULT NULL,
  `forum_code` bigint(20) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `create_at` datetime DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`comment_code`),
  KEY `comment_forum_code_idx` (`forum_code`),
  KEY `comment_user_code_idx` (`user_code`),
  CONSTRAINT `comment_forum_code` FOREIGN KEY (`forum_code`) REFERENCES `forum` (`forum_code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `comment_user_code` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;

/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `file`
--

DROP TABLE IF EXISTS `file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file` (
  `file_code` bigint(20) NOT NULL AUTO_INCREMENT,
  `changed_name` varchar(255) DEFAULT NULL,
  `uploaded_at` datetime DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `file_full_path` varchar(255) DEFAULT NULL,
  `uploaded_by` bigint(20) DEFAULT NULL,
  `download_count` int(11) DEFAULT NULL,
  `original_name` varchar(255) DEFAULT NULL,
  `size` bigint(20) DEFAULT NULL,
  `is_private` bit(1) DEFAULT NULL,
  `folder_code` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`file_code`),
  KEY `file_uploaded_by_idx` (`uploaded_by`),
  KEY `file_folder_code_idx` (`folder_code`),
  CONSTRAINT `file_folder_code` FOREIGN KEY (`folder_code`) REFERENCES `folder` (`folder_code`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `file_uploaded_by` FOREIGN KEY (`uploaded_by`) REFERENCES `user` (`user_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=155 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file`
--

LOCK TABLES `file` WRITE;
/*!40000 ALTER TABLE `file` DISABLE KEYS */;

/*!40000 ALTER TABLE `file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `folder`
--

DROP TABLE IF EXISTS `folder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `folder` (
  `folder_code` bigint(20) NOT NULL AUTO_INCREMENT,
  `folder_name` varchar(255) NOT NULL,
  `create_at` datetime NOT NULL,
  `user_code` bigint(20) DEFAULT NULL,
  `parent_folder_code` bigint(20) DEFAULT NULL,
  `group_code` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`folder_code`),
  KEY `folder_user_code_idx` (`user_code`),
  KEY `folder_folder_code_idx` (`parent_folder_code`),
  KEY `folder_group_code_idx` (`group_code`),
  CONSTRAINT `folder_folder_code` FOREIGN KEY (`parent_folder_code`) REFERENCES `folder` (`folder_code`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `folder_group_code` FOREIGN KEY (`group_code`) REFERENCES `groups` (`group_code`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `folder_user_code` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `folder`
--

LOCK TABLES `folder` WRITE;
/*!40000 ALTER TABLE `folder` DISABLE KEYS */;

/*!40000 ALTER TABLE `folder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forum`
--

DROP TABLE IF EXISTS `forum`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forum` (
  `forum_code` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `content` varchar(3000) DEFAULT NULL,
  `user_code` bigint(20) DEFAULT NULL,
  `create_at` datetime DEFAULT NULL,
  `views` int(11) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`forum_code`),
  KEY `forum_user_code_idx` (`user_code`),
  CONSTRAINT `forum_user_code` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum`
--

LOCK TABLES `forum` WRITE;
/*!40000 ALTER TABLE `forum` DISABLE KEYS */;

/*!40000 ALTER TABLE `forum` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_member`
--

DROP TABLE IF EXISTS `group_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_member` (
  `group_member_code` bigint(20) NOT NULL AUTO_INCREMENT,
  `group_code` bigint(20) NOT NULL,
  `user_code` bigint(20) NOT NULL,
  `join_date` date NOT NULL,
  PRIMARY KEY (`group_member_code`),
  KEY `group_member_group_code_idx` (`group_code`),
  KEY `group_member_user_code_idx` (`user_code`),
  CONSTRAINT `group_member_group_code` FOREIGN KEY (`group_code`) REFERENCES `groups` (`group_code`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `group_member_user_code` FOREIGN KEY (`user_code`) REFERENCES `user` (`user_code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_member`
--

LOCK TABLES `group_member` WRITE;
/*!40000 ALTER TABLE `group_member` DISABLE KEYS */;
/*!40000 ALTER TABLE `group_member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groups` (
  `group_code` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `create_at` date NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `manager` bigint(20) NOT NULL,
  PRIMARY KEY (`group_code`),
  KEY `group_user_code_idx` (`manager`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_code` bigint(20) NOT NULL AUTO_INCREMENT,
  `id` varchar(45) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `user_role` varchar(45) DEFAULT NULL,
  `enable` bit(1) DEFAULT NULL,
  `rpw` varchar(255) DEFAULT NULL,
  `memo` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`user_code`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-24  3:23:48
