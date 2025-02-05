const express = require('express');
const { resolve } = require('path');
const sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');
const cors = require('cors');

const app = express();
const port = 3010;

app.use(express.static('static'));

let db;
(async () => {
  db = await open({
    filename: './bd4_assignment/database.sqlite',
    driver: sqlite3.Database,
  });
})();

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

//Exercise 1: Get All Restaurants
// http://localhost:3000/restaurants
async function getAllRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
}
app.get('/restaurants', async (req, res) => {
  let result = await getAllRestaurants();
  return res.status(200).json(result);
});

// Exercise 2: Get Restaurant by ID
// http://localhost:3000/restaurants/details/1
async function fetchRestaurantById(id) {
  let query = 'SELECT * FROM restaurants WHERE id=?';
  let response = await db.all(query, [id]);
  return response;
}
app.get('/restaurant/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  let result = await fetchRestaurantById(id);
  return res.status(200).json(result);
});

// Exercise 3: Get Restaurants by Cuisine
// http://localhost:3000/restaurants/cuisine/Indian
async function fetchRestaurantByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine=?';
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}
app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;
  let result = await fetchRestaurantByCuisine(cuisine);
  return res.status(200).json(result);
});

async function fetchRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return response;
}

// Exercise 4: Get Restaurants by Filter
// http://localhost:3000/restaurants/filter?isVeg=true&hasOutdoorSeating=true&isLuxury=false
function filterBy(element) {
  return (
    element.isVeg === 'true' &&
    element.isLuxury === 'false' &&
    element.hasOutdoorSeating === 'true'
  );
}
app.get('/restaurants/filter', async (req, res) => {
  let restaurants = await fetchRestaurants();
  let isVeg = req.query.isVeg === 'true';
  let hos = req.query.hos === 'true';
  let isLuxury = req.query.isLuxury === 'false';
  let result = restaurants.filter((element) => filterBy(element));
  return res.status(200).json(result);
});

//Exercise 5: Get Restaurants Sorted by Rating
// http://localhost:3000/restaurants/sort-by-rating
function sortByRating(a, b) {
  return a.rating - b.rating;
}
app.get('/restaurants/sort-by-rating', async (req, res) => {
  let restaurants = await fetchRestaurants();
  let result = restaurants.sort((a, b) => sortByRating(a, b));
  return res.status(200).json(result);
});

// Exercise 6: Get All Dishes
// http://localhost:3000/dishes
async function fetchDishes() {
  let query = 'SELECT * FROM dishes ';
  let response = await db.all(query, []);
  return { dishes: response };
}
app.get('/dishes/', async (req, res) => {
  let result = await fetchDishes();
  return res.status(200).json(result);
});

// Exercise 7: Get Dish by ID
// http://localhost:3000/dishes/details/1
async function fetchDishesById(id) {
  let query = 'SELECT * FROM dishes WHERE id=?';
  let response = await db.all(query, [id]);
  return { dishes: response };
}
app.get('/dishes/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  let result = await fetchDishesById(id);
  return res.status(200).json(result);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
