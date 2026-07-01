-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: KeyboardStoreDB
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `Brands`
--

DROP TABLE IF EXISTS `Brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Brands` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_Brands_Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Brands`
--

LOCK TABLES `Brands` WRITE;
/*!40000 ALTER TABLE `Brands` DISABLE KEYS */;
INSERT INTO `Brands` VALUES (2,'Keychron','Wireless mechanical keyboards and accessories','2026-05-27 08:55:45.970517'),(3,'Royal Kludge','Affordable compact mechanical keyboards','2026-05-27 08:55:45.970532'),(4,'GMK','Premium keycap sets','2026-05-27 08:55:45.970532'),(5,'Monsgeek','I\'m Monsgeek Việt Nam','2026-05-27 09:01:35.307477');
/*!40000 ALTER TABLE `Brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CartItems`
--

DROP TABLE IF EXISTS `CartItems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CartItems` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `ProductId` int NOT NULL,
  `Quantity` int NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `UpdatedAt` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_CartItems_UserId_ProductId` (`UserId`,`ProductId`),
  KEY `IX_CartItems_ProductId` (`ProductId`),
  CONSTRAINT `FK_CartItems_Products_ProductId` FOREIGN KEY (`ProductId`) REFERENCES `Products` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_CartItems_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CartItems`
--

LOCK TABLES `CartItems` WRITE;
/*!40000 ALTER TABLE `CartItems` DISABLE KEYS */;
/*!40000 ALTER TABLE `CartItems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Categories`
--

DROP TABLE IF EXISTS `Categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Categories` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Categories`
--

LOCK TABLES `Categories` WRITE;
/*!40000 ALTER TABLE `Categories` DISABLE KEYS */;
INSERT INTO `Categories` VALUES (1,'Mechanical Keyboards','High-quality mechanical keyboards for gaming and typing'),(2,'Keycaps','Custom keycaps for mechanical keyboards'),(3,'Switches','Mechanical keyboard switches'),(4,'Accessories','Keyboard accessories and tools');
/*!40000 ALTER TABLE `Categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Layouts`
--

DROP TABLE IF EXISTS `Layouts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Layouts` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Percentage` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_Layouts_Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Layouts`
--

LOCK TABLES `Layouts` WRITE;
/*!40000 ALTER TABLE `Layouts` DISABLE KEYS */;
INSERT INTO `Layouts` VALUES (1,'60%','60','Compact layout without function row and navigation cluster'),(2,'75%','75','Compact layout with function row'),(3,'TKL','80','Tenkeyless layout without numpad');
/*!40000 ALTER TABLE `Layouts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OrderDetails`
--

DROP TABLE IF EXISTS `OrderDetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OrderDetails` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `OrderId` int NOT NULL,
  `ProductId` int NOT NULL,
  `Quantity` int NOT NULL,
  `Price` decimal(18,2) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_OrderDetails_OrderId` (`OrderId`),
  KEY `IX_OrderDetails_ProductId` (`ProductId`),
  CONSTRAINT `FK_OrderDetails_Orders_OrderId` FOREIGN KEY (`OrderId`) REFERENCES `Orders` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_OrderDetails_Products_ProductId` FOREIGN KEY (`ProductId`) REFERENCES `Products` (`Id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OrderDetails`
--

LOCK TABLES `OrderDetails` WRITE;
/*!40000 ALTER TABLE `OrderDetails` DISABLE KEYS */;
INSERT INTO `OrderDetails` VALUES (1,1,4,1,1600000.00),(2,2,19,1,490000.00),(3,2,9,1,1350000.00),(4,3,29,1,779000.00),(5,4,25,1,670000.00),(6,4,29,1,779000.00),(7,5,27,1,69000.00),(8,6,27,2,69000.00),(9,7,27,3,69000.00),(10,8,25,1,670000.00),(11,9,14,1,2390000.00);
/*!40000 ALTER TABLE `OrderDetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Orders`
--

DROP TABLE IF EXISTS `Orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Orders` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `TotalAmount` decimal(18,2) NOT NULL,
  `Status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `PaidAt` datetime(6) DEFAULT NULL,
  `PaymentMethod` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `PaymentStatus` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `TransactionId` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `Note` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ShippingAddress` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `ShippingName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `ShippingPhone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`Id`),
  KEY `IX_Orders_UserId` (`UserId`),
  CONSTRAINT `FK_Orders_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Orders`
--

LOCK TABLES `Orders` WRITE;
/*!40000 ALTER TABLE `Orders` DISABLE KEYS */;
INSERT INTO `Orders` VALUES (1,3,1600000.00,'Completed','2026-05-28 04:29:06.575354',NULL,'COD','Unpaid',NULL,'Kèm thư HPBD','E17/2A, TP.HCM','Hoang Van Chien','0374230091'),(2,3,1840000.00,'Completed','2026-05-30 10:08:41.204282','2026-05-30 10:09:51.776764','VNPay','Paid','15562331','','E17/2A, TP.HCM','Hoang Van Chien','0374230091'),(3,3,779000.00,'Pending','2026-05-30 10:21:59.267348',NULL,'COD','Unpaid',NULL,'','E187, TP.HCM','Hoang Van Chien','0374230091'),(4,3,1449000.00,'Pending','2026-05-30 11:36:57.760091',NULL,'COD','Unpaid',NULL,'','E17, TP.HCM','Hoang Van Chien','0374230091'),(5,3,69000.00,'Processing','2026-05-30 11:37:54.942841','2026-05-30 11:38:30.433005','VNPay','Paid','15562379','','E17, TP.HCM','Hoang Van Chien','0374230091'),(6,3,138000.00,'Processing','2026-05-30 11:43:09.622025','2026-05-30 11:43:44.706338','VNPay','Paid','15562383','','E17, TP.HCM','Hoang Van Chien','0374230091'),(7,3,207000.00,'Processing','2026-05-30 11:47:46.223748','2026-05-30 11:48:18.760633','VNPay','Paid','15562388','','E17, TP.HCM','Hoang Van Chien','0374230091'),(8,3,670000.00,'Processing','2026-05-30 11:50:17.405668','2026-05-30 11:50:44.749369','VNPay','Paid','15562390','','E17, TP.HCM','Hoang Van Chien','0374230091'),(9,3,2390000.00,'Pending','2026-05-30 12:01:59.481820','2026-05-30 12:02:36.988727','VNPay','Paid','15562403','','E17, TP.HCM','Hoang Van Chien','0374230091');
/*!40000 ALTER TABLE `Orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ProductImages`
--

DROP TABLE IF EXISTS `ProductImages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ProductImages` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ProductId` int NOT NULL,
  `ImageUrl` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Alt` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `DisplayOrder` int NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ProductImages_ProductId` (`ProductId`),
  CONSTRAINT `FK_ProductImages_Products_ProductId` FOREIGN KEY (`ProductId`) REFERENCES `Products` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ProductImages`
--

LOCK TABLES `ProductImages` WRITE;
/*!40000 ALTER TABLE `ProductImages` DISABLE KEYS */;
INSERT INTO `ProductImages` VALUES (5,4,'/uploads/products/6347736860e14098bfd4d6c4267f21e5.png','Moongeek m1w',2,'2026-05-27 13:35:09.468136'),(6,4,'/uploads/products/0d2d8141377e41078c1344de2a7e5454.jpg','Moongeek m1w',3,'2026-05-27 13:35:09.469413'),(7,4,'/uploads/products/2c295cc6ba9e4ab995de3df8d03cfb34.png','Moongeek m1w',4,'2026-05-27 13:35:09.470716'),(8,4,'/uploads/products/ab8b6a2c81d44d38af01ce583397b91f.png','Moongeek m1w',5,'2026-05-28 06:48:55.693658'),(10,9,'/uploads/products/a2706ba0277949d7837f48264c79e752.webp','RK61',1,'2026-05-29 07:50:50.244203'),(11,9,'/uploads/products/7dcec2a72b1d409d9d7ace3cb8bc9be2.webp','RK61',2,'2026-05-29 07:50:50.244976'),(12,9,'/uploads/products/f710341156da423183c3650eef14e21c.webp','RK61',3,'2026-05-29 07:50:50.245472'),(13,9,'/uploads/products/e07631795a49402b84fc4383d99f8b1e.webp','RK61',4,'2026-05-29 07:50:50.246559'),(14,14,'/uploads/products/066ff4980f454c32b6275abbfe0c5bc0.webp','Keychron K1 V6',1,'2026-05-29 07:57:01.809163'),(15,14,'/uploads/products/d5862e876ea7433890df3a7805e42588.webp','Keychron K1 V6',2,'2026-05-29 07:57:01.810857'),(16,14,'/uploads/products/03867f4aa0ec4f92a9be8028229d3817.webp','Keychron K1 V6',3,'2026-05-29 07:57:01.811517'),(17,14,'/uploads/products/be354d6caac249d0b0650c9417077821.webp','Keychron K1 V6',4,'2026-05-29 07:57:01.812088'),(18,19,'/uploads/products/d5fd74d026f84b0a9a83846f522db749.webp','Glarses x GMK CYL PoB (Purple on Black) Keycaps',1,'2026-05-29 08:03:40.766521'),(19,19,'/uploads/products/e0d9d6013b174b979154ed50b72874a0.webp','Glarses x GMK CYL PoB (Purple on Black) Keycaps',2,'2026-05-29 08:03:40.769263'),(20,19,'/uploads/products/34c29c1441ba496ca339a9ea27be9ea5.jpg','Glarses x GMK CYL PoB (Purple on Black) Keycaps',3,'2026-05-29 08:03:40.775280'),(21,19,'/uploads/products/31cf664d9b82473a8d9ae3adecb60954.webp','Glarses x GMK CYL PoB (Purple on Black) Keycaps',4,'2026-05-29 08:03:40.777983'),(22,24,'/uploads/products/a4917bf0828641269b018b97d77cc27a.jpg','GMK ABS CYL Special Effect Colors Kit',1,'2026-05-29 08:08:12.440138'),(23,24,'/uploads/products/edfb88a9a7254ae9b0b3499905fc1c7c.jpg','GMK ABS CYL Special Effect Colors Kit',2,'2026-05-29 08:08:37.006927'),(24,25,'/uploads/products/f602e69a8cf244a986f8390cf0837a18.jpg','GMK Uniqey Switch Tester',1,'2026-05-29 08:10:07.403117'),(25,25,'/uploads/products/bee923a9dbaa4c23bfbbc537cd366fa1.jpg','GMK Uniqey Switch Tester',2,'2026-05-29 08:10:07.403710'),(26,25,'/uploads/products/6ac94cec0aac4c4f9e9030cfa6c690a5.jpg','GMK Uniqey Switch Tester',3,'2026-05-29 08:10:07.404191'),(27,26,'/uploads/products/77025d7602594816bd9167d8220ed028.jpg','GMK PBT MTNU Stock Colors Kit',1,'2026-05-29 08:12:01.991093'),(28,26,'/uploads/products/2d15863da2414092b92f492f2ae93902.jpg','GMK PBT MTNU Stock Colors Kit',2,'2026-05-29 08:12:01.991708'),(29,26,'/uploads/products/faa266f8413f45f6b089f09cb50fcfb7.jpg','GMK PBT MTNU Stock Colors Kit',3,'2026-05-29 08:12:01.992466'),(30,26,'/uploads/products/9a42215d664946b8905aad812d52a134.jpg','GMK PBT MTNU Stock Colors Kit',4,'2026-05-29 08:12:01.992917'),(31,27,'/uploads/products/522d284f1e0f4a99a9168cee2b40bdb6.jpg','GMK Keycap/Switch Puller Tool',1,'2026-05-29 08:13:57.895047'),(32,27,'/uploads/products/0c513d4917674cc1a6a0b34aee61bdad.jpg','GMK Keycap/Switch Puller Tool',2,'2026-05-29 08:13:57.895574'),(33,27,'/uploads/products/fc38cc8b1cbd4f38984bcf98f9983ab2.jpg','GMK Keycap/Switch Puller Tool',3,'2026-05-29 08:13:57.895998'),(34,28,'/uploads/products/3865de2cb64c4665af2963292356ce3f.webp','Keychron Ultra-Fast Lime Magnetic Switch',1,'2026-05-29 08:17:32.617037'),(35,28,'/uploads/products/2b12fa713632481a8a2cdb4d0f16c873.webp','Keychron Ultra-Fast Lime Magnetic Switch',2,'2026-05-29 08:17:37.142705'),(36,29,'/uploads/products/a1d36760b076446e9772d4c5221b49aa.webp','Keychron Milk POM Low Profile Switch',1,'2026-05-29 08:19:24.461657'),(37,29,'/uploads/products/0a7a4360794d416d8fc134f9f8b604ff.webp','Keychron Milk POM Low Profile Switch',2,'2026-05-29 08:19:24.464012'),(38,29,'/uploads/products/1a11efd44af24df3a5b2c19fca104f3f.webp','Keychron Milk POM Low Profile Switch',3,'2026-05-29 08:19:24.465114'),(39,30,'/uploads/products/11c20e1beb854daab762bfa1c35d7c37.webp','Cherry MX Switch Set',1,'2026-05-29 08:20:56.968031'),(40,30,'/uploads/products/6c59c3be20524cb69b1fb0fadd71fdd9.webp','Cherry MX Switch Set',2,'2026-05-29 08:21:01.362622');
/*!40000 ALTER TABLE `ProductImages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Products`
--

DROP TABLE IF EXISTS `Products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Products` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Price` decimal(18,2) NOT NULL,
  `Stock` int NOT NULL,
  `CategoryId` int NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `LayoutId` int DEFAULT NULL,
  `SwitchTypeId` int DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `BrandId` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`Id`),
  KEY `IX_Products_CategoryId` (`CategoryId`),
  KEY `IX_Products_BrandId` (`BrandId`),
  KEY `IX_Products_LayoutId` (`LayoutId`),
  KEY `IX_Products_SwitchTypeId` (`SwitchTypeId`),
  CONSTRAINT `FK_Products_Brands_BrandId` FOREIGN KEY (`BrandId`) REFERENCES `Brands` (`Id`) ON DELETE RESTRICT,
  CONSTRAINT `FK_Products_Categories_CategoryId` FOREIGN KEY (`CategoryId`) REFERENCES `Categories` (`Id`) ON DELETE RESTRICT,
  CONSTRAINT `FK_Products_Layouts_LayoutId` FOREIGN KEY (`LayoutId`) REFERENCES `Layouts` (`Id`) ON DELETE SET NULL,
  CONSTRAINT `FK_Products_SwitchTypes_SwitchTypeId` FOREIGN KEY (`SwitchTypeId`) REFERENCES `SwitchTypes` (`Id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Products`
--

LOCK TABLES `Products` WRITE;
/*!40000 ALTER TABLE `Products` DISABLE KEYS */;
INSERT INTO `Products` VALUES (4,'Monsgeek M1W','by Moongeek Việt Nam',1600000.00,31,1,'2026-05-27 13:31:22.671684',2,1,'2026-05-28 10:53:22.600152',5),(5,'Monsgeek M1W','Monsgeek - Mechanical Keyboards',1600000.00,32,1,'2026-05-28 10:54:00.149807',2,1,NULL,5),(6,'Monsgeek M1W','Monsgeek - Mechanical Keyboards',1600000.00,32,1,'2026-05-28 10:54:28.976337',2,1,NULL,5),(7,'Monsgeek M1W','Monsgeek - Mechanical Keyboards',1600000.00,32,1,'2026-05-28 10:54:44.268322',2,1,NULL,5),(8,'Monsgeek M1W','Monsgeek - Mechanical Keyboards',1600000.00,32,1,'2026-05-28 10:58:44.082008',2,1,NULL,5),(9,'RK61','Wireless Mechanical Keyboard (Single Color Backlit)',1350000.00,31,1,'2026-05-29 07:49:48.177165',1,2,'2026-05-29 07:50:50.252822',3),(10,'RK61','Wireless Mechanical Keyboard (Single Color Backlit)',1350000.00,32,1,'2026-05-29 07:52:22.710171',1,2,'2026-05-29 07:52:35.758903',3),(11,'RK61',' 60% Wireless Mechanical Keyboard (Single Color Backlit)',1350000.00,32,1,'2026-05-29 07:52:47.471602',1,2,NULL,3),(12,'RK61',' 60% Wireless Mechanical Keyboard (Single Color Backlit)',1350000.00,32,1,'2026-05-29 07:53:00.228213',1,2,NULL,3),(13,'RK61',' 60% Wireless Mechanical Keyboard (Single Color Backlit)',1350000.00,32,1,'2026-05-29 07:53:07.940790',1,2,NULL,3),(14,'Keychron K1 V6','QMK Wireless Mechanical Keyboard (Version 6)',2390000.00,31,1,'2026-05-29 07:55:55.047250',3,3,'2026-05-29 07:57:01.828198',2),(15,'Keychron K1 V6','QMK Wireless Mechanical Keyboard (Version 6)',2390000.00,32,1,'2026-05-29 07:58:10.301534',3,3,NULL,2),(16,'Keychron K1 V6','QMK Wireless Mechanical Keyboard (Version 6)',2390000.00,32,1,'2026-05-29 07:58:21.285345',3,3,NULL,2),(17,'Keychron K1 V6','QMK Wireless Mechanical Keyboard (Version 6)',2390000.00,32,1,'2026-05-29 07:58:28.450939',3,3,NULL,2),(18,'Keychron K1 V6','QMK Wireless Mechanical Keyboard (Version 6)',2390000.00,32,1,'2026-05-29 07:58:43.987505',3,3,NULL,2),(19,'Glarses x GMK CYL PoB (Purple on Black) Keycaps','Discover GMK CYL Purple on Black (PoB) – a premium mechanical keyboard keycap set designed by Glarses X GMK lab. High-quality ABS, vivid purple legends, and iconic black base. Available now at GMK.',490000.00,11,2,'2026-05-29 08:02:22.695936',NULL,NULL,'2026-05-29 08:03:40.785205',4),(20,'Glarses x GMK CYL PoB (Purple on Black) Keycaps','Discover GMK CYL Purple on Black (PoB) – a premium mechanical keyboard keycap set designed by Glarses X GMK lab. High-quality ABS, vivid purple legends, and iconic black base. Available now at GMK.',490000.00,12,2,'2026-05-29 08:04:06.610054',NULL,NULL,NULL,4),(21,'Glarses x GMK CYL PoB (Purple on Black) Keycaps','Discover GMK CYL Purple on Black (PoB) – a premium mechanical keyboard keycap set designed by Glarses X GMK lab. High-quality ABS, vivid purple legends, and iconic black base. Available now at GMK.',490000.00,12,2,'2026-05-29 08:04:10.959968',NULL,NULL,NULL,4),(22,'Glarses x GMK CYL PoB (Purple on Black) Keycaps','Discover GMK CYL Purple on Black (PoB) – a premium mechanical keyboard keycap set designed by Glarses X GMK lab. High-quality ABS, vivid purple legends, and iconic black base. Available now at GMK.',490000.00,12,2,'2026-05-29 08:04:14.159681',NULL,NULL,NULL,4),(23,'Glarses x GMK CYL PoB (Purple on Black) Keycaps','Discover GMK CYL Purple on Black (PoB) – a premium mechanical keyboard keycap set designed by Glarses X GMK lab. High-quality ABS, vivid purple legends, and iconic black base. Available now at GMK.',490000.00,12,2,'2026-05-29 08:04:17.292670',NULL,NULL,NULL,4),(24,'GMK ABS CYL Special Effect Colors Kit','The colorful keyboard kit showcases GMK’s full special effect range - perfect for creating your own exciting keycaps or choosing a custom palette.',1189000.00,12,4,'2026-05-29 08:06:22.830370',NULL,NULL,'2026-05-29 08:08:37.014348',4),(25,'GMK Uniqey Switch Tester','Evaluate the tactile feel and sound of various CHERRY MX switches using the GMK Uniqey Switch Tester, designed for mechanical keyboard enthusiasts.',670000.00,10,4,'2026-05-29 08:09:31.194958',NULL,NULL,'2026-05-29 08:10:07.412285',4),(26,'GMK PBT MTNU Stock Colors Kit','An original premium GMK keycap set is the best upgrade for your mechanical keyboard! Your Keyboard, Your Personality.',2850000.00,12,4,'2026-05-29 08:11:23.157554',NULL,NULL,'2026-05-29 08:12:02.006476',4),(27,'GMK Keycap/Switch Puller Tool','Efficiently remove keycaps and switches using the GMK Keycap/Switch Puller, an essential tool for keyboard enthusiasts.',69000.00,19,4,'2026-05-29 08:12:57.859832',NULL,NULL,'2026-05-29 08:13:57.906420',4),(28,'Keychron Ultra-Fast Lime Magnetic Switch','The Keychron Ultra-Fast Lime Magnetic Switch Set comes with 110 switches and the bottle',779000.00,25,3,'2026-05-29 08:16:53.895428',NULL,NULL,'2026-05-29 08:17:37.150332',2),(29,'Keychron Milk POM Low Profile Switch','Each Keychron Milk POM Low Profile Mechanical Switch Set comes with 45 switches and 110 switches options to choose.',779000.00,23,3,'2026-05-29 08:18:45.036572',NULL,NULL,'2026-05-29 08:19:24.484624',2),(30,'Cherry MX Switch Set','Each Switch Set comes with 35 switches or 110 switches to choose. ',1118000.00,25,3,'2026-05-29 08:20:27.392524',NULL,NULL,'2026-05-29 08:21:01.368775',2);
/*!40000 ALTER TABLE `Products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RefreshTokens`
--

DROP TABLE IF EXISTS `RefreshTokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RefreshTokens` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `Token` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ExpiresAt` datetime(6) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `IsRevoked` tinyint(1) NOT NULL,
  `RevokedAt` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_RefreshTokens_Token` (`Token`),
  KEY `IX_RefreshTokens_UserId` (`UserId`),
  CONSTRAINT `FK_RefreshTokens_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RefreshTokens`
--

LOCK TABLES `RefreshTokens` WRITE;
/*!40000 ALTER TABLE `RefreshTokens` DISABLE KEYS */;
INSERT INTO `RefreshTokens` VALUES (1,1,'buguaRA7FRAvvO3esyIojzM9eZFpHAAqXr0YSjQefB1nHt5vrTBbM0fO4sJY4BLv2t1wcMF3MAAMALJeML1BTA==','2026-06-03 09:00:59.726107','2026-05-27 09:00:59.726136',0,NULL),(3,1,'+h9BSUJ99JcgXUaYtB9VljeRnxZ2gUQCLNay1TeWTTACx4AQyM31ErFNgznlEFV/UuD6fkv4HfdtcZ28UuTCgg==','2026-06-03 13:28:43.173298','2026-05-27 13:28:43.173315',0,NULL),(4,1,'9GABVZ+5k+jXCyFEYZox2sd9qtFRRDRTYVJqcWaGGXGtOOWsmuc9+PLwwbHkw/dxWoA61wt6wnDkMjXXHJ2o7A==','2026-06-03 13:39:47.331704','2026-05-27 13:39:47.331721',0,NULL),(6,3,'Kh0HBxm1l/x2SEHqJ92YvT/3tYfc+1DQKU7cOZ+gutI/2udr+MPb6ISr+iGNc1hNCG2h4EcY3I6oeF1RHjhDwA==','2026-06-04 04:28:23.497335','2026-05-28 04:28:23.497336',1,'2026-05-28 04:41:18.156065'),(7,1,'zXNYFC1U1QnSGotm4t3XTNuE/1NTluurHB5WB4sJHG2j6lGyjLlV6IJs3P/8+RQtTPR8S+qCcMqGA/wNUJPaEw==','2026-06-04 04:41:26.251544','2026-05-28 04:41:26.251545',0,NULL),(8,1,'V4z3nvD/DBcpBvsY0+VThOduArR6F5O6AfJK9PlRc8ga7Rj3V1TWqSYhA0w0lGFhd+xxRHDfQEYxCAH/u2xX2A==','2026-06-04 06:46:28.950066','2026-05-28 06:46:28.950084',0,NULL),(9,3,'VEDI11L9qQFJ6+5scn5pOzreB3EiAjpPJC947J7Bk6Oe5wRrT69Ued2MiGQ4JdkylBugSd766M3ECCa9s7K0Ug==','2026-06-04 09:31:46.525647','2026-05-28 09:31:46.525648',1,'2026-05-28 09:33:06.423287'),(10,1,'efPjvmfrxVuFOE6LlIr/EWCwfYgBE5HPtY/42Kcdp7QH+//ymI5ey7MZzwjc1J93UsWge77BxgBxC4CcqetOJg==','2026-06-04 09:33:18.871098','2026-05-28 09:33:18.871100',1,'2026-05-28 10:35:52.025638'),(11,1,'avU9cXquur+Xh4pcY1mU3UI8mpBVaZkkTE8kL0JfmawTH5OSd3yMSHVzxxDHOK8ckwhcokDQ68KLqIiqFwSeyQ==','2026-06-04 10:35:51.958163','2026-05-28 10:35:51.958180',0,NULL),(12,1,'2TK7ywg6TuouQAx064BWDFFRoPUkC8dYS/4bx0tIFhlogCGQao2S/HDX75oFpFZa4bmSk6Q7NBYAh62pZXZRwQ==','2026-06-04 10:36:57.312052','2026-05-28 10:36:57.312053',1,'2026-05-28 11:04:32.495751'),(13,1,'B2KkmR5+DXuLgzghU82qyr3rtWRF7fIH5Njsq6tAgYm6tsfbQ0yvie9lFylhbWyKLWRCfOuoOMo9sDAFDDM/rA==','2026-06-05 03:31:36.030782','2026-05-29 03:31:36.030799',1,'2026-05-29 07:47:04.306417'),(14,1,'kuj8+jF2Bm6t2KbFPsCDaRVLxPYTPrrUMaj6FAn+AJGCGuSTIT0VhdpHIDIt3D5G75JU05c4cBOw3UaKZbxjmQ==','2026-06-05 07:47:04.191795','2026-05-29 07:47:04.191812',0,NULL),(15,1,'wXtow48aukUrlzEs5Kr41dmWwyK0GE6fQv1Civv8bfYlfLW5rkXrYO8NYRRFwZTFKjk1o3g7p1KEcCctRGU+Jw==','2026-06-05 07:47:14.921637','2026-05-29 07:47:14.921637',1,'2026-05-29 08:23:19.749684'),(16,1,'eDf2ULPmSugYheZZT2eOo1x5ivxJbcQ81LFQ970vncuHqzvaxqtIXmkXVNAJimkN8EZgcjrw8DUMZONu/71ZQg==','2026-06-06 10:01:55.043097','2026-05-30 10:01:55.043137',1,'2026-05-30 11:34:35.632334'),(17,3,'Xq/6JEotuJuRKkVmhhLo57Xbjjr8KXgdXizTFKTmo+PWInDXOfYR1dcSOT1WJZRWsjpNgFtv46FMFuF+gUxW/Q==','2026-06-06 10:02:53.095009','2026-05-30 10:02:53.095010',0,NULL),(18,1,'LGHOC8dep9z9Xs3/GE7k55KB9j4ES4q398MOboKpg0R2YShbGKJ51t9XORks0mwLOLSHJ5OdMe0hTEQGuE9jig==','2026-06-06 11:34:35.052581','2026-05-30 11:34:35.052621',0,NULL),(19,1,'mMCp/nSv9WSvr1bDZPMDaMaG9nZiOVgoBOMMYiJy5VdKatgmV1oJdw1+EA2jopkApp1E6LDC0opiCDo7mfZzWQ==','2026-06-06 11:34:50.118788','2026-05-30 11:34:50.118790',1,'2026-05-30 12:30:12.833603'),(20,3,'9Y2XzgAWr8nD/hUvA+yZQh7PN/EuyT8QwooOV6BX8zPlWSlAwYoW7QDJisqJC/LDNasa2Dn+CSwZzQSGmWt8PQ==','2026-06-06 11:36:04.694553','2026-05-30 11:36:04.694554',1,'2026-05-30 11:39:45.101977'),(21,3,'Lo+YXrAl0d1QVcxwjNvMk8cuTOuykVDvSl7pT+T/no2eCTNa4Pz5SFONkxtS//xVQ6HF3FHiE59CMTW+bnF7xA==','2026-06-06 11:39:54.353683','2026-05-30 11:39:54.353683',1,'2026-05-30 11:44:03.104324'),(22,3,'SZlyXk3iyAGfoVbSJNDUBmSfK3HDbZSCr7k8XKOQy5Cs3i4d6rC8facAO77w7fqX+/6Jfvhyxcl1s4Ubm/7h+g==','2026-06-06 11:44:16.769691','2026-05-30 11:44:16.769692',0,NULL);
/*!40000 ALTER TABLE `RefreshTokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SwitchTypes`
--

DROP TABLE IF EXISTS `SwitchTypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SwitchTypes` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_SwitchTypes_Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SwitchTypes`
--

LOCK TABLES `SwitchTypes` WRITE;
/*!40000 ALTER TABLE `SwitchTypes` DISABLE KEYS */;
INSERT INTO `SwitchTypes` VALUES (1,'Linear','Linear mechanical switch'),(2,'Tactile','Tactile mechanical switch'),(3,'Clicky','Clicky mechanical switch');
/*!40000 ALTER TABLE `SwitchTypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `PasswordHash` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `EmailVerificationTokenExpiresAt` datetime(6) DEFAULT NULL,
  `EmailVerificationTokenHash` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `EmailVerifiedAt` datetime(6) DEFAULT NULL,
  `IsEmailVerified` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_Users_Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'admin@keyboardstore.com','$2a$11$O2jLWv//wLkS0FoPHTYJO.4BKZnFeRHpBt2YCoFUNdFKqC.4xw.dG','Admin','2026-05-27 08:41:42.850808',NULL,NULL,'2026-05-27 08:41:42.850808',1),(3,'chienvan1203@gmail.com','$2a$11$ptHnyU4Ykj83UIWFlw73POkmyRVwXeYY62kSjSsKCXyPtSgsD4AEq','User','2026-05-28 04:27:15.278996',NULL,NULL,'2026-05-28 04:27:35.724396',1);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `__EFMigrationsHistory`
--

DROP TABLE IF EXISTS `__EFMigrationsHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `__EFMigrationsHistory` (
  `MigrationId` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProductVersion` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `__EFMigrationsHistory`
--

LOCK TABLES `__EFMigrationsHistory` WRITE;
/*!40000 ALTER TABLE `__EFMigrationsHistory` DISABLE KEYS */;
INSERT INTO `__EFMigrationsHistory` VALUES ('20260424114004_InitialCreate','8.0.11'),('20260426095950_AddRefreshToken','8.0.11'),('20260511102422_AddPaymentFieldsToOrder','8.0.11'),('20260515050000_AddCartAndShippingInfo','8.0.11'),('20260527050518_AddProductCatalogMetadata','8.0.11'),('20260527053456_RemoveProductImageUrlColumn','8.0.11'),('20260527103219_AddEmailVerificationToUsers','8.0.11');
/*!40000 ALTER TABLE `__EFMigrationsHistory` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-01 19:56:45
