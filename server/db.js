const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/ProArt_auth_store_db"
);
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT || "shhh";

// Create the tables
const createTables = async () => {
  const SQL = `
  DROP TABLE IF EXISTS favorites CASCADE;
  DROP TABLE IF EXISTS cart_items CASCADE;
  DROP TABLE IF EXISTS products CASCADE;
  DROP TABLE IF EXISTS categories CASCADE;
  DROP TYPE IF EXISTS category_type CASCADE;
  DROP TABLE IF EXISTS users CASCADE;

    CREATE TYPE category_type AS ENUM (
      'Electronics',
      'Clothing',
      'Books'
    );

    CREATE TABLE users (
      id UUID DEFAULT gen_random_uuid(),
      username VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      PRIMARY KEY (id)
    );

    CREATE TABLE categories(
      id UUID DEFAULT gen_random_uuid(),
      name VARCHAR(20),
      type category_type NOT NULL,
      description TEXT,
      PRIMARY KEY (id)
    );

    CREATE TABLE products (
      id UUID DEFAULT gen_random_uuid(),
      name VARCHAR(20),
      date DATE NOT NULL,
      description TEXT,
      image TEXT,
      category_id UUID REFERENCES categories(id),
      PRIMARY KEY (id)
    );

    CREATE TABLE cart_items (
      id UUID DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id),
      product_id UUID REFERENCES products(id),
      quantity INTEGER NOT NULL,
      PRIMARY KEY (id)
    );CREATE TABLE favorites (
      id UUID DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) NOT NULL,
      product_id UUID REFERENCES products(id) NOT NULL,
      PRIMARY KEY (id),
      UNIQUE (user_id, product_id)
    );
  `;

  await client.query(SQL);
};

// Create functions for CRUD operations
const createUser = async ({ username, password }) => {
  const SQL = `
    INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    username,
    await bcrypt.hash(password, 5),
  ]);
  return response.rows[0];
};

const createProduct = async ({
  name,
  date,
  description,
  image,
  category_id,
}) => {
  const SQL = `
    INSERT INTO products(id, name, date, description, image, category_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    name,
    date,
    description,
    image,
    category_id,
  ]);
  return response.rows[0];
};

const createCategory = async ({ name, type, description }) => {
  const SQL = `
    INSERT INTO categories(id, name, type, description) VALUES($1, $2, $3, $4) RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    name,
    type,
    description,
  ]);
  return response.rows[0];
};

const createCartItem = async ({ user_id, product_id, quantity }) => {
  const SQL = `
    INSERT INTO cart_items(id, user_id, product_id, quantity) VALUES($1, $2,$3, $4) RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    user_id,
    product_id,
    quantity,
  ]);
  return response.rows[0];
};

const createFavorite = async ({ user_id, product_id }) => {
  const SQL = `
    INSERT INTO favorites(id, user_id, product_id) VALUES($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, product_id]);
  return response.rows[0];
};

const deleteUser = async (id) => {
  const SQL = `
    DELETE FROM users WHERE id = $1
  `;
  await client.query(SQL, [id]);
};

const deleteProduct = async (id) => {
  const SQL = `
    DELETE FROM products WHERE id = $1
  `;
  await client.query(SQL, [id]);
};

const deleteCategory = async (id) => {
  const SQL = `
    DELETE FROM categories WHERE id = $1
  `;
  await client.query(SQL, [id]);
};

const deleteCartItem = async (id) => {
  const SQL = `
    DELETE FROM cart_items WHERE id = $1
  `;
  await client.query(SQL, [id]);
};

const deleteFavorite = async (id) => {
  const SQL = `
    DELETE FROM favorites WHERE id = $1
  `;
  await client.query(SQL, [id]);
};

const updateUser = async (id, { username, password }) => {
  const SQL = `
    UPDATE users SET username = $2, password = $3 WHERE id = $1 RETURNING *
  `;
  const response = await client.query(SQL, [id, username, password]);
  return response.rows[0];
};

const updateProduct = async (
  id,
  { name, date, description, image, category_id }
) => {
  const SQL = `
    UPDATE products SET name = $2, 
      date = $3,
      description = $4,
      image = $5,
      category_id = $6
      WHERE id = $1 RETURNING *
  `;
  const response = await client.query(SQL, [
    id,
    name,
    date,
    description,
    image,
    category_id,
  ]);
  return response.rows[0];
};

const updateCategory = async (id, { name, type, description }) => {
  const SQL = `
    UPDATE categories SET name = $2,
    type = $3,
    description = $4
    WHERE id = $1 RETURNING *
  `;
  const response = await client.query(SQL, [id, name, type, description]);
  return response.rows[0];
};

const updateCartItem = async (id, { user_id, product_id, quantity }) => {
  const SQL = `
    UPDATE cart_items SET user_id = $2,
      product_id = $3,
      quantity = $4
      WHERE id = $1 RETURNING *
  `;
  const response = await client.query(SQL, [id, user_id, product_id, quantity]);
  return response.rows[0];
};

const updateFavorite = async (id, { user_id, product_id }) => {
  const SQL = `
    UPDATE favorites SET user_id = $2,
      product_id = $3
      WHERE id = $1 RETURNING *
  `;
  const response = await client.query(SQL, [id, user_id, product_id]);
  return response.rows[0];
};

// Additional Functions

const authenticate = async ({ username, password }) => {
  const SQL = `
    SELECT * FROM users
    WHERE users.username = $1
  `;

  const response = await client.query(SQL, [username]);

  if (!response.rowCount) {
    return null;
  }

  const user = response.rows[0];

  if ((await bcrypt.compare(password, user.password)) && user) {
    const payload = {
      id: user.id,
      role: "user",
    };

    const token = jwt.sign(payload, JWT);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }
  return null;
};

const findUserByToken = async (token) => {
  const payload = jwt.verify(token, JWT);
  const ID = payload.id;
  const SQL = `
    SELECT * FROM users
    WHERE users.id = $1
  `;

  const response = await client.query(SQL, [ID]);

  if (!response.rowCount) {
    return null;
  }

  const user = response.rows[0];

  return user;
};

const authMiddleware = (...methods) => {
  return async (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      res.status(401).json({
        error: "You are not authorized",
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      const user = await findUserByToken(token);

      if (!user) {
        res.status(401).json({
          error: "You are not authorized",
        });
      }

      req.currentUser = user;

      methods.forEach((method) => {
        if (method instanceof Function) {
          method(req, res, next);
        }
      });
    } catch (error) {
      res.status(500).json({
        error: "Something went wrong",
      });
    }
  };
};

module.exports = {
  client,
  createTables,
  createUser,
  createProduct,
  createCategory,
  createCartItem,
  createFavorite,
  deleteUser,
  deleteProduct,
  deleteCategory,
  deleteCartItem,
  deleteFavorite,
  updateUser,
  updateProduct,
  updateCategory,
  updateCartItem,
  updateFavorite,
  authenticate,
  authMiddleware,
  findUserByToken,
};
