const {
  client,
  createTables,
  createUser,
  createProduct,
  createFavorite,
  fetchUsers,
  fetchProducts,
  fetchFavorites,
  destroyFavorite,
  authenticate,
  findUserWithToken,
} = require("./db");

const express = require("express");
const app = express();
app.use(express.json());

//for deployment only
const path = require("path");
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);
app.use(
  "/assets",
  express.static(path.join(__dirname, "../client/dist/assets"))
);

const isLoggedIn = async (req, res, next) => {
  try {
    req.user = await findUserWithToken(req.headers.authorization);
    next();
  } catch (ex) {
    next(ex);
  }
};

app.post("/api/auth/login", async (req, res, next) => {
  try {
    res.send(await authenticate(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/auth/me", isLoggedIn, async (req, res, next) => {
  try {
    res.send(await findUserWithToken(req.headers.authorization));
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/users", async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/users/:id/favorites", async (req, res, next) => {
  try {
    res.send(await fetchFavorites(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/users/:id/favorites", isLoggedIn, async (req, res, next) => {
  try {
    res.status(201).send(
      await createFavorite({
        user_id: req.params.id,
        product_id: req.body.product_id,
      })
    );
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/auth/register", async (req, res, next) => {
  try {
    res.send(await createUser(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.delete(
  "/api/users/:user_id/favorites/:id",
  isLoggedIn,
  async (req, res, next) => {
    try {
      await destroyFavorite({ user_id: req.params.user_id, id: req.params.id });
      res.sendStatus(204);
    } catch (ex) {
      next(ex);
    }
  }
);

app.get("/api/products", async (req, res, next) => {
  try {
    res.send(await fetchProducts());
  } catch (ex) {
    next(ex);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(err.status || 500)
    .send({ error: err.message ? err.message : err });
});

const init = async () => {
  const port = process.env.PORT || 3000;
  await client.connect();
  console.log("connected to database");

  await createTables();
  console.log("tables created");

  const [moe, lucy, ethyl, curly, foo, bar, bazz, quq, fip] = await Promise.all(
    [
      createUser({ username: "moe", password: "123456" }),
      createUser({ username: "lucy", password: "123457" }),
      createUser({ username: "ethyl", password: "123458" }),
      createUser({ username: "curly", password: "123459" }),
      createProduct({ name: "foo" }),
      createProduct({ name: "bar" }),
      createProduct({ name: "bazz" }),
      createProduct({ name: "quq" }),
      createProduct({ name: "fip" }),
    ]
  );

  console.log(await fetchUsers());
  console.log(await fetchProducts());

  console.log(await fetchFavorites(moe.id));

  const favorite = await createFavorite({
    user_id: moe.id,
    product_id: foo.id,
  });
  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();

const {
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
} = require("./db");

const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
app.use(bodyParser.json());

// API endpoints

// Authentication
app.post("/auth", async (req, res) => {
  const { username, password } = req.body;
  const result = await db.authenticate({ username, password });
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// CRUD operations

// Users
app.post("/users", async (req, res) => {
  const { username, password } = req.body;
  const user = await db.createUser({ username, password });
  init.users.push(user);
  res.status(201).json(user);
});

app.get("/users", async (req, res) => {
  const users = await db.fetchUsers();
  res.status(200).json(users);
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  await db.deleteUser(id);
  const updatedUsers = await db.fetchUsers();
  init.users = updatedUsers;
  res.status(200).json(updatedUsers);
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;
  const updatedUser = await db.updateUser(id, { username, password });
  const updatedUsers = await db.fetchUsers();
  init.users = updatedUsers;
  res.status(200).json(updatedUsers);
}); // Products
app.post("/products", async (req, res) => {
  const { name, date, description, image, category_id } = req.body;
  const product = await db.createProduct({
    name,
    date,
    description,
    image,
    category_id,
  });
  init.products.push(product);
  res.status(201).json(product);
});

app.get("/products", async (req, res) => {
  const products = await db.fetchProducts();
  res.status(200).json(products);
});

// Categories
app.post("/categories", async (req, res) => {
  const { name, type, description } = req.body;
  const category = await db.createCategory({ name, type, description });
  init.categories.push(category);
  res.status(201).json(category);
});

app.get("/categories", async (req, res) => {
  const categories = await db.fetchCategories();
  res.status(200).json(categories);
});

// Cart Items
app.post("/cart-items", async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  const cartItem = await db.createCartItem({ user_id, product_id, quantity });
  init.cartItems.push(cartItem);
  res.status(201).json(cartItem);
});

app.get("/cart-items", async (req, res) => {
  const cartItems = await db.fetchCartItems();
  res.status(200).json(cartItems);
});

// Favorites
app.post("/favorites", async (req, res) => {
  const { user_id, product_id } = req.body;
  const favorite = await db.createFavorite({ user_id, product_id });
  init.favorites.push(favorite);
  res.status(201).json(favorite);
});

app.get("/favorites", async (req, res) => {
  const favorite = await db.fetchFavorites(user_id);
  res.status(200).json(favorite);
});

// Cart Items
app.post("/cart-items", async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  const cartItem = await db.createCartItem({ user_id, product_id, quantity });
  const updatedCartItems = await db.fetchCartItems();
  res.status(201).json(cartItem);
});

app.delete("/cart-items/:id", async (req, res) => {
  const { id } = req.params;
  await db.deleteCartItem(id);
  const updatedCartItems = await db.fetchCartItems();
  res.status(200).json(updatedCartItems);
});

// Favorites
app.post("/favorites", async (req, res) => {
  const { user_id, product_id } = req.body;
  const favorite = await db.createFavorite({ user_id, product_id });
  const updatedFavorites = await db.fetchFavorites();
  res.status(201).json(favorite);
});

app.delete("/favorites/:id", async (req, res) => {
  const { id } = req.params;
  await db.deleteFavorite(id);
  const updatedFavorites = await db.fetchFavorites();
  res.status(200).json(updatedFavorites);
});

const init = async () => {
  const port = process.env.PORT || 3000;
  await client.connect();
  console.log("connected to database");

  await createTables();
  console.log("tables created");

  const [moe, lucy, ethyl, curly, foo, bar, bazz, quq, fip] = await Promise.all(
    [
      createUser({ username: "moe", password: "123456" }),
      createUser({ username: "lucy", password: "123457" }),
      createUser({ username: "ethyl", password: "123458" }),
      createUser({ username: "curly", password: "123459" }),
      createProduct({ name: "foo" }),
      createProduct({ name: "bar" }),
      createProduct({ name: "bazz" }),
      createProduct({ name: "quq" }),
      createProduct({ name: "fip" }),
    ]
  );

  console.log(await fetchUsers());
  console.log(await fetchProducts());

  console.log(await fetchFavorites(moe.id));

  const favorite = await createFavorite({
    user_id: moe.id,
    product_id: foo.id,
  });
  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
