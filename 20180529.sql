-- --------------------------------------------------------
-- 主机:                           localhost
-- 服务器版本:                        5.7.21 - MySQL Community Server (GPL)
-- 服务器操作系统:                      Linux
-- HeidiSQL 版本:                  9.5.0.5264
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- 导出 cocacms 的数据库结构
CREATE DATABASE IF NOT EXISTS `cocacms` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `cocacms`;

-- 导出  表 cocacms.admin 结构
CREATE TABLE IF NOT EXISTS `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(50) NOT NULL COMMENT '邮箱账号',
  `password` varchar(32) NOT NULL COMMENT '密码',
  `nickname` varchar(32) NOT NULL COMMENT '昵称',
  `is_super` tinyint(1) NOT NULL DEFAULT '0' COMMENT '超级管理员 1是 0否',
  PRIMARY KEY (`id`),
  UNIQUE KEY `account` (`account`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- 正在导出表  cocacms.admin 的数据：~1 rows (大约)
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` (`id`, `account`, `password`, `nickname`, `is_super`) VALUES
	(1, 'admin@admin.com', '71f74b8d19266f28f8c713d99899c259', '超级管理员', 1);
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;

-- 导出  表 cocacms.admin_role 结构
CREATE TABLE IF NOT EXISTS `admin_role` (
  `rid` int(32) NOT NULL,
  `uid` int(32) NOT NULL,
  PRIMARY KEY (`uid`,`rid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='用户-角色';

-- 正在导出表  cocacms.admin_role 的数据：~0 rows (大约)
/*!40000 ALTER TABLE `admin_role` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_role` ENABLE KEYS */;

-- 导出  表 cocacms.category 结构
CREATE TABLE IF NOT EXISTS `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `site_id` int(11) NOT NULL COMMENT '站点id',
  `key` varchar(50) NOT NULL COMMENT '栏目关键字',
  `name` varchar(50) NOT NULL COMMENT '栏目名称',
  `type` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '栏目类型：1列表页 2单页 3表单页',
  `description` longtext COMMENT '描述',
  `pic` json DEFAULT NULL COMMENT '图片集',
  `model_id` int(11) DEFAULT NULL COMMENT '绑定模型ID',
  `bind` int(11) DEFAULT NULL COMMENT '单页绑定的数据ID',
  `template_list` varchar(255) DEFAULT NULL COMMENT '列表渲染页',
  `template_detail` varchar(255) DEFAULT NULL COMMENT '详情渲染页',
  `template_page` varchar(255) DEFAULT NULL COMMENT '单页渲染页',
  `template_form` varchar(255) DEFAULT NULL COMMENT '表单渲染页',
  `lft` int(11) NOT NULL,
  `rgt` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `pid` int(11) NOT NULL DEFAULT '-1',
  `is_del` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`,`site_id`),
  KEY `lft` (`lft`),
  KEY `rgt` (`rgt`),
  KEY `is_del` (`is_del`),
  KEY `FK_category_model` (`model_id`),
  KEY `FK_category_site` (`site_id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COMMENT='栏目';

-- 正在导出表  cocacms.category 的数据：~1 rows (大约)
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` (`id`, `site_id`, `key`, `name`, `type`, `description`, `pic`, `model_id`, `bind`, `template_list`, `template_detail`, `template_page`, `template_form`, `lft`, `rgt`, `level`, `pid`, `is_del`) VALUES
	(44, 1, '__root__', '根节点', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 2, 0, -1, 0);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;

-- 导出  表 cocacms.form 结构
CREATE TABLE IF NOT EXISTS `form` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(50) NOT NULL COMMENT '表单关键字',
  `model_id` int(11) NOT NULL COMMENT '绑定模型ID',
  `name` varchar(50) NOT NULL COMMENT '表单名称',
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`),
  KEY `model_id` (`model_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='表单';

-- 正在导出表  cocacms.form 的数据：~0 rows (大约)
/*!40000 ALTER TABLE `form` DISABLE KEYS */;
/*!40000 ALTER TABLE `form` ENABLE KEYS */;

-- 导出  表 cocacms.menu 结构
CREATE TABLE IF NOT EXISTS `menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `site_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL COMMENT '菜单名称',
  `type` tinyint(1) NOT NULL COMMENT '菜单链接类型：1绑定栏目，2普通URL',
  `url` varchar(255) DEFAULT NULL COMMENT '菜单链接',
  `category_id` int(11) DEFAULT NULL COMMENT '菜单栏目id',
  `lft` int(11) NOT NULL,
  `rgt` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `pid` int(11) NOT NULL DEFAULT '-1',
  `is_del` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `lft` (`lft`),
  KEY `rgt` (`rgt`),
  KEY `FK_menu_category` (`category_id`),
  KEY `FK_menu_site` (`site_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COMMENT='导航';

-- 正在导出表  cocacms.menu 的数据：~1 rows (大约)
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` (`id`, `site_id`, `name`, `type`, `url`, `category_id`, `lft`, `rgt`, `level`, `pid`, `is_del`) VALUES
	(5, 1, '根节点', 1, NULL, NULL, 1, 2, 0, -1, 0);
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;

-- 导出  表 cocacms.model 结构
CREATE TABLE IF NOT EXISTS `model` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(50) NOT NULL COMMENT '模型关键字',
  `name` varchar(50) NOT NULL COMMENT '模型名称',
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COMMENT='模型表';

-- 正在导出表  cocacms.model 的数据：~0 rows (大约)
/*!40000 ALTER TABLE `model` DISABLE KEYS */;
/*!40000 ALTER TABLE `model` ENABLE KEYS */;

-- 导出  表 cocacms.model_attribute 结构
CREATE TABLE IF NOT EXISTS `model_attribute` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `model_id` int(11) NOT NULL COMMENT '模型id',
  `key` varchar(50) NOT NULL COMMENT '字段关键字',
  `name` varchar(50) NOT NULL COMMENT '字段名称',
  `required` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否必填 1是 0否',
  `tableable` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否显示在列表 1是 0否',
  `sortable` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否可排序',
  `default` varchar(50) DEFAULT NULL COMMENT '默认值',
  `type` varchar(50) NOT NULL COMMENT '字段类型',
  `options` varchar(255) NOT NULL DEFAULT '',
  `len` int(11) NOT NULL COMMENT '字段长度',
  `rules` json DEFAULT NULL COMMENT '验证规则',
  `sort` int(11) NOT NULL DEFAULT '0' COMMENT '显示顺序',
  PRIMARY KEY (`id`),
  UNIQUE KEY `model_id_key` (`model_id`,`key`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COMMENT='模型参数';

-- 正在导出表  cocacms.model_attribute 的数据：~0 rows (大约)
/*!40000 ALTER TABLE `model_attribute` DISABLE KEYS */;
/*!40000 ALTER TABLE `model_attribute` ENABLE KEYS */;

-- 导出  表 cocacms.permission 结构
CREATE TABLE IF NOT EXISTS `permission` (
  `id` int(32) NOT NULL AUTO_INCREMENT,
  `role_id` int(32) NOT NULL COMMENT '角色id',
  `method` varchar(128) NOT NULL DEFAULT 'get' COMMENT '方法',
  `uri` varchar(128) NOT NULL COMMENT '路径',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_permission_role` (`role_id`,`method`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='角色权限分配';

-- 正在导出表  cocacms.permission 的数据：~0 rows (大约)
/*!40000 ALTER TABLE `permission` DISABLE KEYS */;
/*!40000 ALTER TABLE `permission` ENABLE KEYS */;

-- 导出  表 cocacms.role 结构
CREATE TABLE IF NOT EXISTS `role` (
  `id` int(32) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='角色';

-- 正在导出表  cocacms.role 的数据：~0 rows (大约)
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
/*!40000 ALTER TABLE `role` ENABLE KEYS */;

-- 导出  表 cocacms.site 结构
CREATE TABLE IF NOT EXISTS `site` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `locale` varchar(50) NOT NULL DEFAULT 'zh-CN',
  `config` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COMMENT='站点';

-- 正在导出表  cocacms.site 的数据：~2 rows (大约)
/*!40000 ALTER TABLE `site` DISABLE KEYS */;
INSERT INTO `site` (`id`, `name`, `locale`, `config`) VALUES
	(1, '中文站', 'zh-CN', '{"upload": {"type": "local", "fileSize": "5mb", "extension": ".jpg|.jpeg|.png|.gif|.mp3|.mp4"}, "company": {"tel": "-", "mail": "rojerchen@qq.com", "name": "厦门空帆船科技有限公司", "qr_wb": ["http://localhost:7001/public/upload/e52f7b4eab80452f9d2924391c15dc6c.png"], "qr_wx": ["http://localhost:7001/public/upload/a647e7f54ee8418f9d76b98418b6a5c3.png"], "address": "厦门", "position": "118.175209,24.490686"}, "defaults": {"icp": "CocaCMS", "logo": ["http://localhost:7001/public/upload/cfa34967d86748b1b148a8c35de7323f.png"], "title": "CocaCMS", "keyword": "CocaCMS", "description": "CocaCMS"}}'),
	(2, 'English', 'en-US', NULL);
/*!40000 ALTER TABLE `site` ENABLE KEYS */;

-- 导出  表 cocacms.theme 结构
CREATE TABLE IF NOT EXISTS `theme` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `package` varchar(50) NOT NULL COMMENT '包名',
  `name` varchar(50) NOT NULL COMMENT '模板名称',
  `dirname` varchar(50) NOT NULL COMMENT '文件夹名称',
  `author` varchar(50) NOT NULL COMMENT '作者',
  `use` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否使用',
  PRIMARY KEY (`id`),
  UNIQUE KEY `package` (`package`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COMMENT='主题';

-- 正在导出表  cocacms.theme 的数据：~1 rows (大约)
/*!40000 ALTER TABLE `theme` DISABLE KEYS */;
INSERT INTO `theme` (`id`, `package`, `name`, `dirname`, `author`, `use`) VALUES
	(2, 'rojer@default', '默认模板', 'default', 'rojer', 1);
/*!40000 ALTER TABLE `theme` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
