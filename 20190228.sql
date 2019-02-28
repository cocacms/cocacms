-- --------------------------------------------------------
-- 主机:                           127.0.0.1
-- Server version:               5.7.22-log - MySQL Community Server (GPL)
-- Server OS:                    Linux
-- HeidiSQL 版本:                  10.1.0.5464
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table young-space.admin
CREATE TABLE IF NOT EXISTS `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(50) NOT NULL COMMENT '邮箱账号',
  `password` varchar(32) NOT NULL COMMENT '密码',
  `nickname` varchar(32) NOT NULL COMMENT '昵称',
  `is_super` tinyint(1) NOT NULL DEFAULT '0' COMMENT '超级管理员 1是 0否',
  PRIMARY KEY (`id`),
  UNIQUE KEY `account` (`account`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.
-- Dumping structure for table young-space.admin_role
CREATE TABLE IF NOT EXISTS `admin_role` (
  `rid` int(32) NOT NULL,
  `uid` int(32) NOT NULL,
  PRIMARY KEY (`uid`,`rid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='用户-角色';

-- Data exporting was unselected.
-- Dumping structure for table young-space.auto_model_activity
CREATE TABLE IF NOT EXISTS `auto_model_activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `site_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `title` varchar(125) NOT NULL COMMENT '活动名称',
  `max` int(11) NOT NULL COMMENT '活动最大人数',
  `description` varchar(125) NOT NULL COMMENT '活动简介',
  `context` longtext COMMENT '活动图文',
  `pic` longtext NOT NULL COMMENT '活动图片',
  PRIMARY KEY (`id`),
  KEY `auto_index_key` (`site_id`,`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.
-- Dumping structure for table young-space.auto_model_activity_sign
CREATE TABLE IF NOT EXISTS `auto_model_activity_sign` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `site_id` int(11) NOT NULL,
  `form_model_id` int(11) DEFAULT NULL,
  `test` text COMMENT 'test',
  PRIMARY KEY (`id`),
  KEY `auto_index_key` (`site_id`,`form_model_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.
-- Dumping structure for table young-space.auto_model_config
CREATE TABLE IF NOT EXISTS `auto_model_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `site_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `address` varchar(2014) DEFAULT NULL COMMENT '协会地址',
  `contact` varchar(30) DEFAULT NULL COMMENT '联系方式',
  `qrcode` longtext COMMENT '二维码',
  PRIMARY KEY (`id`),
  KEY `auto_index_key` (`site_id`,`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.
-- Dumping structure for table young-space.auto_model_news
CREATE TABLE IF NOT EXISTS `auto_model_news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `site_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `title` varchar(225) NOT NULL COMMENT '标题',
  `context` longtext COMMENT '内容',
  `recommend` tinyint(1) DEFAULT NULL COMMENT '推荐',
  PRIMARY KEY (`id`),
  KEY `auto_index_key` (`site_id`,`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.
-- Dumping structure for table young-space.auto_model_organization
CREATE TABLE IF NOT EXISTS `auto_model_organization` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `site_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `pic` longtext NOT NULL COMMENT '组织架构图片',
  `context` longtext COMMENT '组织图文介绍',
  `description` text COMMENT '组织简介',
  PRIMARY KEY (`id`),
  KEY `auto_index_key` (`site_id`,`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.
-- Dumping structure for table young-space.auto_model_tutor
CREATE TABLE IF NOT EXISTS `auto_model_tutor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `site_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(10) NOT NULL COMMENT '导师名称',
  `pic` longtext NOT NULL COMMENT '导师图片',
  `job` varchar(25) DEFAULT NULL COMMENT '导师专业',
  `another_name` text COMMENT '导师头衔',
  `context` longtext COMMENT '导师介绍',
  `recommend` tinyint(1) DEFAULT '0' COMMENT '推荐',
  PRIMARY KEY (`id`),
  KEY `auto_index_key` (`site_id`,`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.
-- Dumping structure for table young-space.category
CREATE TABLE IF NOT EXISTS `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `site_id` int(11) NOT NULL COMMENT '站点id',
  `key` varchar(50) NOT NULL COMMENT '栏目关键字',
  `name` varchar(50) NOT NULL COMMENT '栏目名称',
  `type` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '栏目类型：1列表页 2单页 3表单页 4调整链接',
  `url` varchar(255) DEFAULT NULL COMMENT '调整链接',
  `content` longtext COMMENT '描述',
  `description` longtext COMMENT 'SEO description',
  `keyword` varchar(1024) DEFAULT NULL COMMENT 'SEO keyword',
  `pic` json DEFAULT NULL COMMENT '图片集',
  `model_id` int(11) DEFAULT NULL COMMENT '绑定模型ID',
  `form_id` int(11) DEFAULT NULL COMMENT '绑定表单ID',
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
  KEY `FK_category_site` (`site_id`),
  KEY `form_id` (`form_id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COMMENT='栏目';

-- Data exporting was unselected.
-- Dumping structure for table young-space.form
CREATE TABLE IF NOT EXISTS `form` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(50) NOT NULL COMMENT '表单关键字',
  `model_id` int(11) NOT NULL COMMENT '绑定模型ID',
  `form_id` int(11) DEFAULT NULL COMMENT '绑定表单ID',
  `name` varchar(50) NOT NULL COMMENT '表单名称',
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`),
  KEY `model_id` (`model_id`),
  KEY `form_id` (`form_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COMMENT='表单';

-- Data exporting was unselected.
-- Dumping structure for table young-space.menu
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COMMENT='导航';

-- Data exporting was unselected.
-- Dumping structure for table young-space.model
CREATE TABLE IF NOT EXISTS `model` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(50) NOT NULL COMMENT '模型关键字',
  `type` int(11) NOT NULL DEFAULT '0' COMMENT '模型类型 0-内容模型 1-表单模型 2-系统配置',
  `name` varchar(50) NOT NULL COMMENT '模型名称',
  `width` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COMMENT='模型表';

-- Data exporting was unselected.
-- Dumping structure for table young-space.model_attribute
CREATE TABLE IF NOT EXISTS `model_attribute` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `model_id` int(11) NOT NULL COMMENT '模型id',
  `key` varchar(50) NOT NULL COMMENT '字段关键字',
  `name` varchar(50) NOT NULL COMMENT '字段名称',
  `onlyread` tinyint(1) NOT NULL DEFAULT '0',
  `required` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否必填 1是 0否',
  `tableable` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否显示在列表 1是 0否',
  `sortable` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否可排序',
  `default` varchar(50) DEFAULT NULL COMMENT '默认值',
  `type` varchar(50) NOT NULL COMMENT '字段类型',
  `options` varchar(255) NOT NULL DEFAULT '',
  `len` varchar(50) NOT NULL COMMENT '字段长度',
  `rules` json DEFAULT NULL COMMENT '验证规则',
  `sort` int(11) NOT NULL DEFAULT '0' COMMENT '显示顺序',
  PRIMARY KEY (`id`),
  UNIQUE KEY `model_id_key` (`model_id`,`key`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COMMENT='模型参数';

-- Data exporting was unselected.
-- Dumping structure for table young-space.permission
CREATE TABLE IF NOT EXISTS `permission` (
  `id` int(32) NOT NULL AUTO_INCREMENT,
  `role_id` int(32) NOT NULL COMMENT '角色id',
  `method` varchar(128) NOT NULL DEFAULT 'get' COMMENT '方法',
  `uri` varchar(128) NOT NULL COMMENT '路径',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_permission_role` (`role_id`,`method`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='角色权限分配';

-- Data exporting was unselected.
-- Dumping structure for table young-space.plugin
CREATE TABLE IF NOT EXISTS `plugin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dirname` varchar(255) NOT NULL DEFAULT '0' COMMENT '文件名',
  `type` int(11) DEFAULT '1' COMMENT '类型',
  `name` varchar(50) NOT NULL COMMENT '名称',
  `author` varchar(50) NOT NULL,
  `mail` varchar(50) DEFAULT NULL,
  `enable` tinyint(1) DEFAULT '0',
  `installed` tinyint(1) NOT NULL DEFAULT '0',
  `config` json DEFAULT NULL,
  `setting` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dirname` (`dirname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.
-- Dumping structure for table young-space.role
CREATE TABLE IF NOT EXISTS `role` (
  `id` int(32) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='角色';

-- Data exporting was unselected.
-- Dumping structure for table young-space.site
CREATE TABLE IF NOT EXISTS `site` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `locale` varchar(50) NOT NULL DEFAULT 'zh-CN',
  `config` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='站点';

-- Data exporting was unselected.
-- Dumping structure for table young-space.theme
CREATE TABLE IF NOT EXISTS `theme` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `package` varchar(50) NOT NULL COMMENT '包名',
  `name` varchar(50) NOT NULL COMMENT '模板名称',
  `dirname` varchar(50) NOT NULL COMMENT '文件夹名称',
  `author` varchar(50) NOT NULL COMMENT '作者',
  `use` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否使用',
  PRIMARY KEY (`id`),
  UNIQUE KEY `package` (`package`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COMMENT='主题';

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

INSERT INTO `admin` (`id`, `account`, `password`, `nickname`, `is_super`) VALUES
	(1, 'admin@admin.com', '71f74b8d19266f28f8c713d99899c259', '超级管理员', 1);

INSERT INTO `site` (`id`, `name`, `locale`, `config`) VALUES
	(1, '中文站', 'zh-CN', '{"upload": {"type": "local", "fileSize": "5mb", "extension": ".jpg|.jpeg|.png|.gif|.mp3|.mp4"}, "defaults": {"icp": "CocaCMS", "title": "CocaCMS", "keyword": "CocaCMS", "description": "CocaCMS"}}');

INSERT INTO `theme` (`id`, `package`, `name`, `dirname`, `author`, `use`) VALUES
	(1, 'rojer@default', '默认模板', 'default', 'rojer', 1);
