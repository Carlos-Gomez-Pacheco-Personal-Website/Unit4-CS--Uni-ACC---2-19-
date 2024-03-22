const {
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////

const isLoggedIn = async (req, res, next) => {
  try {
    const user = await findUserByToken(req.headers.authorization);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    next(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    // Assuming 'findUserByToken' returns the user object with a role or isAdmin property
    const user = await findUserByToken(req.headers.authorization);

    if (user && user.isAdmin) {
      // or user.role === 'admin'
      next(); // User is an admin, proceed to the next middleware
    } else {
      res.status(403).send("Access denied. Admins only."); // User is not an admin
    }
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
};

// Apply the 'authMiddleware' to all routes that require authentication
app.use("/api", authMiddleware);
// Authentication middleware to verify if the user is logged in
// const authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
//     const user = await findUserByToken(token);
//     if (!user) {
//       return res.status(401).send("Unauthorized");
//     }
//     req.user = user; // Add user to the request object
//     next();
//   } catch (error) {
//     res.status(401).send("Unauthorized");
//   }
// };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Check if we need this to handle auth by me or not!
FIXME: app.post("/api/auth/login", async (req, res, next) => {
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
// Check if we need this to handle auth by me or not!

///////////////////////////////////////////////////////////////////////////////////

// User Routes
TODO: app.post("/api/users", async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    res.status(201).send(user);
  } catch (error) {
    next(error);
  }
});

app.put("/api/users/:id", isLoggedIn, async (req, res, next) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/users/:id", isLoggedIn, async (req, res, next) => {
  try {
    await deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Product Routes
app.post("/api/products", isAdmin, async (req, res, next) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).send(product);
  } catch (error) {
    next(error);
  }
});

app.put("/api/products/:id", isAdmin, async (req, res, next) => {
  try {
    const product = await updateProduct(req.params.id, req.body);
    res.send(product);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/products/:id", isAdmin, async (req, res, next) => {
  try {
    await deleteProduct(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Category Routes
app.post("/api/categories", isAdmin, async (req, res, next) => {
  try {
    const category = await createCategory(req.body);
    res.status(201).send(category);
  } catch (error) {
    next(error);
  }
});

app.put("/api/categories/:id", isAdmin, async (req, res, next) => {
  try {
    const category = await updateCategory(req.params.id, req.body);
    res.send(category);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/categories/:id", isAdmin, async (req, res, next) => {
  try {
    await deleteCategory(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Cart Item Routes
app.post("/api/cart-items", isLoggedIn, async (req, res, next) => {
  try {
    const cartItem = await createCartItem(req.body);
    res.status(201).send(cartItem);
  } catch (error) {
    next(error);
  }
});

app.put("/api/cart-items/:id", isLoggedIn, async (req, res, next) => {
  try {
    const cartItem = await updateCartItem(req.params.id, req.body);
    res.send(cartItem);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/cart-items/:id", isLoggedIn, async (req, res, next) => {
  try {
    await deleteCartItem(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Favorite Routes
app.post("/api/favorites", isLoggedIn, async (req, res, next) => {
  try {
    const favorite = await createFavorite(req.body);
    res.status(201).send(favorite);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/favorites/:id", isLoggedIn, async (req, res, next) => {
  try {
    await deleteFavorite(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.put("/api/favorites/:id", isLoggedIn, async (req, res, next) => {
  try {
    const updatedFavorite = await updateFavorite(req.params.id, req.body);
    res.status(200).json(updatedFavorite);
  } catch (error) {
    next(error);
  }
});

// Authentication Routes
app.post("/api/auth/login", async (req, res, next) => {
  try {
    const user = await authenticate(req.body);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

////////////////////////////////////////////////////////////////////////////////////////
app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(err.status || 500)
    .send({ error: err.message ? err.message : err });
});

const init = async () => {
  const port = process.env.PORT || 3000;

  try {
    await client.connect();
    console.log("connected to database");
    await createTables();
    console.log("tables created");
    // First, create categories to ensure we have the category IDs
    const [electronicsCategory, clothingCategory] = await Promise.all([
      createCategory({
        name: "Electronics",
        type: "Electronics",
        description: "All electronic items",
      }),
      createCategory({
        name: "Clothing",
        type: "Apparel",
        description: "Fashionable apparel and accessories",
      }),
    ]);

    // Now that we have category IDs, we can create products
    const [laptopProduct, tshirtProduct] = await Promise.all([
      createProduct({
        name: "Laptop",
        date: new Date(),
        description: "High-performance laptop",
        image:
          "https://www.bhphotovideo.com/images/images2500x2500/asus_g513qr_es96_15_6_republic_of_gamers_1616909.jpg",
        cost: 999.99,
        category_id: electronicsCategory.id,
      }),
      createProduct({
        name: "T-Shirt",
        date: new Date(),
        description: "Cotton unisex t-shirt",
        image:
          "https://th.bing.com/th/id/OIP.DSjZPk9uy01_f2ox4Q5QPgHaHa?rs=1&pid=ImgDetMain",
        cost: 19.99,
        category_id: clothingCategory.id,
      }),
    ]);

    // Finally, create users, cart items, and favorites
    const [adminUser, regularUser, cartItem1, favorite1] = await Promise.all([
      createUser({
        username: "admin",
        password: "adminpassword",
        isAdmin: true,
      }),
      createUser({
        username: "user",
        password: "userpassword",
        isAdmin: false,
      }),
      createCartItem({
        user_id: regularUser.id,
        product_id: laptopProduct.id,
        quantity: 1,
      }),
      createFavorite({ user_id: regularUser.id, product_id: tshirtProduct.id }),
    ]);

    console.log("Initialization completed");
  } catch (error) {
    console.error("Failed to initialize the application:", error);
  }

  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();

// const {
//   createTables,
//   createUser,
//   createProduct,
//   createCategory,
//   createCartItem,
//   createFavorite,
//   deleteUser,
//   deleteProduct,
//   deleteCategory,
//   deleteCartItem,
//   deleteFavorite,
//   updateUser,
//   updateProduct,
//   updateCategory,
//   updateCartItem,
//   updateFavorite,
//   authenticate,
//   authMiddleware,
//   findUserByToken,
// } = require("./db");

// const express = require("express");
// const bodyParser = require("body-parser");
// const db = require("./db");

// const app = express();
// app.use(bodyParser.json());

// // API endpoints

// // Authentication
// app.post("/auth", async (req, res) => {
//   const { username, password } = req.body;
//   const result = await db.authenticate({ username, password });
//   if (result) {
//     res.status(200).json(result);
//   } else {
//     res.status(401).json({ error: "Invalid credentials" });
//   }
// });

// // CRUD operations

// // Users
// app.post("/users", async (req, res) => {
//   const { username, password } = req.body;
//   const user = await db.createUser({ username, password });
//   init.users.push(user);
//   res.status(201).json(user);
// });

// app.get("/users", async (req, res) => {
//   const users = await db.fetchUsers();
//   res.status(200).json(users);
// });

// app.delete("/users/:id", async (req, res) => {
//   const { id } = req.params;
//   await db.deleteUser(id);
//   const updatedUsers = await db.fetchUsers();
//   init.users = updatedUsers;
//   res.status(200).json(updatedUsers);
// });

// app.put("/users/:id", async (req, res) => {
//   const { id } = req.params;
//   const { username, password } = req.body;
//   const updatedUser = await db.updateUser(id, { username, password });
//   const updatedUsers = await db.fetchUsers();
//   init.users = updatedUsers;
//   res.status(200).json(updatedUsers);
// }); // Products
// app.post("/products", async (req, res) => {
//   const { name, date, description, image, category_id } = req.body;
//   const product = await db.createProduct({
//     name,
//     date,
//     description,
//     image,
//     category_id,
//   });
//   init.products.push(product);
//   res.status(201).json(product);
// });

// app.get("/products", async (req, res) => {
//   const products = await db.fetchProducts();
//   res.status(200).json(products);
// });

// // Categories
// app.post("/categories", async (req, res) => {
//   const { name, type, description } = req.body;
//   const category = await db.createCategory({ name, type, description });
//   init.categories.push(category);
//   res.status(201).json(category);
// });

// app.get("/categories", async (req, res) => {
//   const categories = await db.fetchCategories();
//   res.status(200).json(categories);
// });

// // Cart Items
// app.post("/cart-items", async (req, res) => {
//   const { user_id, product_id, quantity } = req.body;
//   const cartItem = await db.createCartItem({ user_id, product_id, quantity });
//   init.cartItems.push(cartItem);
//   res.status(201).json(cartItem);
// });

// app.get("/cart-items", async (req, res) => {
//   const cartItems = await db.fetchCartItems();
//   res.status(200).json(cartItems);
// });

// // Favorites
// app.post("/favorites", async (req, res) => {
//   const { user_id, product_id } = req.body;
//   const favorite = await db.createFavorite({ user_id, product_id });
//   init.favorites.push(favorite);
//   res.status(201).json(favorite);
// });

// app.get("/favorites", async (req, res) => {
//   const favorite = await db.fetchFavorites(user_id);
//   res.status(200).json(favorite);
// });

// // Cart Items
// app.post("/cart-items", async (req, res) => {
//   const { user_id, product_id, quantity } = req.body;
//   const cartItem = await db.createCartItem({ user_id, product_id, quantity });
//   const updatedCartItems = await db.fetchCartItems();
//   res.status(201).json(cartItem);
// });

// app.delete("/cart-items/:id", async (req, res) => {
//   const { id } = req.params;
//   await db.deleteCartItem(id);
//   const updatedCartItems = await db.fetchCartItems();
//   res.status(200).json(updatedCartItems);
// });

// // Favorites
// app.post("/favorites", async (req, res) => {
//   const { user_id, product_id } = req.body;
//   const favorite = await db.createFavorite({ user_id, product_id });
//   const updatedFavorites = await db.fetchFavorites();
//   res.status(201).json(favorite);
// });

// app.delete("/favorites/:id", async (req, res) => {
//   const { id } = req.params;
//   await db.deleteFavorite(id);
//   const updatedFavorites = await db.fetchFavorites();
//   res.status(200).json(updatedFavorites);
// });

// const init = async () => {
//   const port = process.env.PORT || 3000;
//   await client.connect();
//   console.log("connected to database");

//   await createTables();
//   console.log("tables created");

//   const [moe, lucy, ethyl, curly, foo, bar, bazz, quq, fip] = await Promise.all(
//     [
//       createUser({ username: "moe", password: "123456" }),
//       createUser({ username: "lucy", password: "123457" }),
//       createUser({ username: "ethyl", password: "123458" }),
//       createUser({ username: "curly", password: "123459" }),
//       createProduct({ name: "foo" }),
//       createProduct({ name: "bar" }),
//       createProduct({ name: "bazz" }),
//       createProduct({ name: "quq" }),
//       createProduct({ name: "fip" }),
//     ]
//   );

//   console.log(await fetchUsers());
//   console.log(await fetchProducts());

//   console.log(await fetchFavorites(moe.id));

//   const favorite = await createFavorite({
//     user_id: moe.id,
//     product_id: foo.id,
//   });
//   app.listen(port, () => console.log(`listening on port ${port}`));
// };

// init();
