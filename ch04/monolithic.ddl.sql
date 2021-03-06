CREATE TABLE GOODS (
	id int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(128) NOT NULL,
    category VARCHAR(128) NOT NULL,
    price INT(11) NOT NULL DEFAULT 0,
    description text NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE MEMBERS (
	id int(11) NOT NULL AUTO_INCREMENT,
    username varchar(128) NOT NULL,
    `password` VARCHAR(256) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY UKY_MEMBERS_USERNAME (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE PURCHASES (
	id int(11) NOT NULL AUTO_INCREMENT,
    userid int(11) NOT NULL,
    goodsid int(11) NOT NULL,
    `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;