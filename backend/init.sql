CREATE TABLE `t_claim`  (
  `id` bigint NOT NULL COMMENT '主键 自增',
  `name` varchar(50) NULL COMMENT '声明标题',
  `content` varchar(300) NULL COMMENT '声明内容',
  `creator_id` bigint NULL COMMENT '创建者ID',
  `topic_id` bigint NULL COMMENT '所属主题ID',
  `is_delete` int NULL DEFAULT 0 COMMENT '是否删除 1-是 0-否',
  `gmt_create` datetime NULL COMMENT '创建时间',
  `gmt_modify` datetime NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB COMMENT = '声明表';

CREATE TABLE `t_claims_rel`  (
  `id` bigint NOT NULL COMMENT '主键 自增',
  `claim_id` bigint NOT NULL COMMENT '声明ID',
  `rel_claim_id` bigint NOT NULL COMMENT '被关联的声明ID',
  `creator_id` bigint NULL COMMENT '创建人ID',
  `gmt_create` datetime NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB COMMENT = '声明与声明的关联表\n一个声明可以与多个其他声明相关联';

CREATE TABLE `t_reply`  (
  `id` bigint NOT NULL COMMENT '主键 自增',
  `content` varchar(300) NULL COMMENT '评论/回复内容',
  `creator_id` bigint NULL COMMENT '评论/回复人ID',
  `topic_id` bigint NULL COMMENT '关联主题ID',
  `claim_id` bigint NULL COMMENT '关联声明ID',
  `reply_id` bigint NULL COMMENT '关联评论ID',
  `type` int NULL COMMENT '1-评论 2-回复',
  `idea` int NULL COMMENT '1-澄清 2-支持 3-反对',
  `is_delete` int NULL DEFAULT 0 COMMENT '是否删除 1-是 0-否',
  `gmt_create` datetime NULL COMMENT '创建时间',
  `gmt_modify` datetime NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB COMMENT = '评论/回复表';

CREATE TABLE `t_topic`  (
  `id` bigint NOT NULL COMMENT '主键 自增',
  `name` varchar(100) NULL COMMENT '主题标题',
  `creator_id` bigint NULL COMMENT '创建者ID',
  `is_delete` int NULL DEFAULT 0 COMMENT '是否删除 1-是 0-否',
  `gmt_create` datetime NULL COMMENT '创建时间',
  `gmt_modify` datetime NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB COMMENT = '主题表';

CREATE TABLE `t_user`  (
  `id` bigint NOT NULL COMMENT '主键 自增',
  `name` varchar(20) NULL COMMENT '用户账号',
  `password` varchar(50) NULL COMMENT '用户密码',
  `sex` int NULL COMMENT '性别 1-男 0-女',
  `gmt_create` datetime NULL COMMENT '注册时间',
  `gmt_modify` datetime NULL COMMENT '更新时间',
  `avatar` varchar(1000) NULL COMMENT '头像地址',
  `status` int NULL COMMENT '用户状态 1-正常 2-锁定 3-注销',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB COMMENT = '用户基础表';

ALTER TABLE `t_claim` ADD CONSTRAINT `fk_creator_id` FOREIGN KEY (`creator_id`) REFERENCES `t_user` (`id`);
ALTER TABLE `t_claim` ADD CONSTRAINT `fk_topic_id` FOREIGN KEY (`topic_id`) REFERENCES `t_topic` (`id`);
ALTER TABLE `t_claims_rel` ADD CONSTRAINT `fk_creator_id` FOREIGN KEY (`creator_id`) REFERENCES `t_user` (`id`);
ALTER TABLE `t_reply` ADD CONSTRAINT `fk_creator_id` FOREIGN KEY (`creator_id`) REFERENCES `t_user` (`id`);
ALTER TABLE `t_reply` ADD CONSTRAINT `fk_topic_id` FOREIGN KEY (`topic_id`) REFERENCES `t_topic` (`id`);
ALTER TABLE `t_reply` ADD CONSTRAINT `fk_claim_id` FOREIGN KEY (`claim_id`) REFERENCES `t_claim` (`id`);
ALTER TABLE `t_reply` ADD CONSTRAINT `fk_reply_id` FOREIGN KEY (`reply_id`) REFERENCES `t_reply` (`id`);
ALTER TABLE `t_topic` ADD CONSTRAINT `fk_creator_id` FOREIGN KEY (`creator_id`) REFERENCES `t_user` (`id`);

