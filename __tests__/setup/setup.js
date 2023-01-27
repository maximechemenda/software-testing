const axios = require("axios");
const {prepare}  = require("./test-helper")

module.exports = async () => {
  // We use the API to register.
  // Alternatively, you can do it by using Mongoose API,
  // by applying direct DB operations.
  await axios.post(prepare("/users/register"), {
    "name": "Admin",
    "role": "Admin",
    "email": "test@test.com",
    "password": "12345",
    "address": "Somewhere 10"
  });

  await axios.post(prepare("/users/register"), {
    "name": "Admin2",
    "role": "Admin",
    "email": "test2@test.com",
    "password": "12345",
    "address": "Somewhere 10"
  });

  await axios.post(prepare("/users/register"), {
    "name": "User",
    "role": "User",
    "email": "testuser@test.com",
    "password": "12345",
    "address": "Somewhere 10"
  });

  await axios.post(prepare("/users/register"), {
    "name": "User ToDelete",
    "role": "User",
    "email": "testusertodelete@test.com",
    "password": "12345",
    "address": "Somewhere 10"
  });

  await axios.post(prepare("/users/register"), {
    "name": "User2",
    "role": "User",
    "email": "testuser2@test.com",
    "password": "12345",
    "address": "Somewhere 20"
  });

  await axios.post(prepare("/users/register"), {
    "name": "UserWith2Boxes",
    "role": "User",
    "email": "testuserwith2boxes@test.com",
    "password": "12345",
    "address": "Somewhere 20"
  });

};