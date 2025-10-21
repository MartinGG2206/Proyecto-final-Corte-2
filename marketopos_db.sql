-- Marketopos - Esquema MySQL (XAMPP)
CREATE DATABASE IF NOT EXISTS marketopos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'marketopos'@'localhost' IDENTIFIED BY 'StrongLocalPass!';
GRANT ALL PRIVILEGES ON marketopos.* TO 'marketopos'@'localhost';
FLUSH PRIVILEGES;

USE marketopos;

DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS product_categories;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','seller','customer') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  status ENUM('draft','published','paused') DEFAULT 'published',
  seller_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id)
);

CREATE TABLE product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  url VARCHAR(255) NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  slug VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE product_categories (
  product_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (product_id, category_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE carts (
  user_id INT PRIMARY KEY,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  qty INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_cart_item (user_id, product_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE likes (
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (product_id, user_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_review (product_id, user_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Semillas
INSERT INTO users (name,email,password_hash,role) VALUES
('Admin','admin@marketopos.com','','admin'),
('Demo Vendedor','seller@marketopos.com','','seller'),
('Demo Cliente','client@marketopos.com','','customer');

INSERT INTO categories (name, slug) VALUES
('Tecnología','tecnologia'),('Hogar','hogar'),('Moda','moda'),('Deportes','deportes'),('Libros','libros');

INSERT INTO products (title,description,price,stock,status,seller_id) VALUES
('Smartwatch de última generación','Pantalla AMOLED, ECG, GPS',499.90,30,'published',2),
('Auriculares inalámbricos con cancelación de ruido','ANC premium',299.00,50,'published',2),
('Cámara réflex digital profesional','Sensor APS-C, 4K',899.00,15,'published',2),
('Bicicleta de montaña de alta gama','Suspensión, 12v',1200.00,8,'published',2),
('Laptop ultraligera','13\" 16GB/512GB',1399.00,12,'published',2),
('Sofá modular','3 puestos, tela premium',890.00,6,'published',2),
('Vestido de verano','Nueva colección',79.00,22,'published',2),
('Zapatillas deportivas','Edición limitada',129.00,40,'published',2);

INSERT INTO product_images (product_id, url) VALUES
(1,'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=1200&q=80&auto=format&fit=crop'),
(2,'https://images.unsplash.com/photo-1518441798258-8fbcd101ebb9?w=1200&q=80&auto=format&fit=crop'),
(3,'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&q=80&auto=format&fit=crop'),
(4,'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80&auto=format&fit=crop'),
(5,'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80&auto=format&fit=crop'),
(6,'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?w=1200&q=80&auto=format&fit=crop'),
(7,'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1200&q=80&auto=format&fit=crop'),
(8,'https://images.unsplash.com/photo-1539185441755-769473a23570?w=1200&q=80&auto=format&fit=crop');
