/**
增加mail字段
**/
ALTER TABLE users ADD COLUMN mail VARCHAR(100) DEFAULT NULL COMMENT 'mail' AFTER PASSWORD

/**
增加联合唯一索引
**/
alter table klines add unique index (symbol,line_type,start_time);


/**
增加联合唯一索引
**/
alter table coin_surprises add unique index (symbol,line_type);