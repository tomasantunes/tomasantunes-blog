CREATE TABLE posts (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(1024) NOT NULL,
    slug VARCHAR(1024) NOT NULL,
    content TEXT,
    tags VARCHAR(2048),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE images (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(1024) NOT NULL,
    filename VARCHAR(1024) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE comments (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    post_id INT(11) NOT NULL,
    parent_id INT(11),
    author VARCHAR(1024) NOT NULL,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE analytics (
  id int(20) NOT NULL,
  page_url varchar(150) NOT NULL,
  entry_time datetime NOT NULL,
  exit_time datetime DEFAULT NULL,
  ip_address varchar(30) NOT NULL,
  country varchar(50) NOT NULL,
  operating_system varchar(20) NOT NULL,
  browser varchar(20) NOT NULL,
  browser_version varchar(20) NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE posts MODIFY COLUMN content LONGTEXT; 