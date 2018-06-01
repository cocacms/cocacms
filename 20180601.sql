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


-- 导出 enzoani 的数据库结构
CREATE DATABASE IF NOT EXISTS `enzoani` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `enzoani`;

-- 导出  表 enzoani.admin 结构
CREATE TABLE IF NOT EXISTS `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(50) NOT NULL COMMENT '邮箱账号',
  `password` varchar(32) NOT NULL COMMENT '密码',
  `nickname` varchar(32) NOT NULL COMMENT '昵称',
  `is_super` tinyint(1) NOT NULL DEFAULT '0' COMMENT '超级管理员 1是 0否',
  PRIMARY KEY (`id`),
  UNIQUE KEY `account` (`account`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- 数据导出被取消选择。
-- 导出  表 enzoani.admin_role 结构
CREATE TABLE IF NOT EXISTS `admin_role` (
  `rid` int(32) NOT NULL,
  `uid` int(32) NOT NULL,
  PRIMARY KEY (`uid`,`rid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='用户-角色';

-- 数据导出被取消选择。
-- 导出  表 enzoani.category 结构
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
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COMMENT='栏目';

-- 数据导出被取消选择。
-- 导出  表 enzoani.form 结构
CREATE TABLE IF NOT EXISTS `form` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(50) NOT NULL COMMENT '表单关键字',
  `model_id` int(11) NOT NULL COMMENT '绑定模型ID',
  `name` varchar(50) NOT NULL COMMENT '表单名称',
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`),
  KEY `model_id` (`model_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='表单';

-- 数据导出被取消选择。
-- 导出  表 enzoani.menu 结构
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COMMENT='导航';

-- 数据导出被取消选择。
-- 导出  表 enzoani.model 结构
CREATE TABLE IF NOT EXISTS `model` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(50) NOT NULL COMMENT '模型关键字',
  `name` varchar(50) NOT NULL COMMENT '模型名称',
  `width` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COMMENT='模型表';

-- 数据导出被取消选择。
-- 导出  表 enzoani.model_attribute 结构
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
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COMMENT='模型参数';

-- 数据导出被取消选择。
-- 导出  表 enzoani.permission 结构
CREATE TABLE IF NOT EXISTS `permission` (
  `id` int(32) NOT NULL AUTO_INCREMENT,
  `role_id` int(32) NOT NULL COMMENT '角色id',
  `method` varchar(128) NOT NULL DEFAULT 'get' COMMENT '方法',
  `uri` varchar(128) NOT NULL COMMENT '路径',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `FK_permission_role` (`role_id`,`method`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='角色权限分配';

-- 数据导出被取消选择。
-- 导出  表 enzoani.role 结构
CREATE TABLE IF NOT EXISTS `role` (
  `id` int(32) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 ROW_FORMAT=COMPACT COMMENT='角色';

-- 数据导出被取消选择。
-- 导出  表 enzoani.site 结构
CREATE TABLE IF NOT EXISTS `site` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `locale` varchar(50) NOT NULL DEFAULT 'zh-CN',
  `config` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='站点';

-- 数据导出被取消选择。
-- 导出  表 enzoani.theme 结构
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

-- 数据导出被取消选择。
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
