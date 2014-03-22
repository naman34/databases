-- CREATE DATABASE `chat`;

USE `chat`;

DROP TABLE IF EXISTS `message`;

CREATE TABLE `message` (
  `id` INTEGER AUTO_INCREMENT DEFAULT NULL,
  `text` MEDIUMTEXT,
  `updatedAt` TIMESTAMP,
  `createdAt` DATETIME,
  `id_room` INTEGER,
  `id_user` INTEGER,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'room'
--
-- ---

DROP TABLE IF EXISTS `room`;

CREATE TABLE `room` (
  `id` INTEGER AUTO_INCREMENT DEFAULT NULL,
  `roomname` VARCHAR(40) UNIQUE DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'user'
--
-- ---

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` INTEGER AUTO_INCREMENT DEFAULT NULL,
  `username` VARCHAR(40) UNIQUE DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Foreign Keys
-- ---

ALTER TABLE `message` ADD FOREIGN KEY (id_room) REFERENCES `room` (`id`);
ALTER TABLE `message` ADD FOREIGN KEY (id_user) REFERENCES `user` (`id`);

-- ---
-- Table Properties
-- ---

ALTER TABLE `message` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
ALTER TABLE `room` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
ALTER TABLE `user` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
