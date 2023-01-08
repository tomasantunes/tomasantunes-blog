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

ALTER TABLE posts MODIFY COLUMN content LONGTEXT; 