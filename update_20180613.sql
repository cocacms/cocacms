ALTER TABLE `model_attribute`
	ADD COLUMN `onlyread` TINYINT(1) NOT NULL DEFAULT '0' AFTER `name`;

ALTER TABLE `model_attribute`
	CHANGE COLUMN `len` `len` VARCHAR(50) NOT NULL COMMENT '字段长度' AFTER `options`;