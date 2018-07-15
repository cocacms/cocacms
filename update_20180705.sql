ALTER TABLE `model`
	ADD COLUMN `type` INT(11) NOT NULL DEFAULT '0' COMMENT '模型类型 0-内容模型 1-表单模型 2-系统配置' AFTER `key`;
ALTER TABLE `plugin`
	ADD COLUMN `setting` JSON NULL DEFAULT NULL AFTER `config`;
