
const axios = require("axios");
const mongoose = require("mongoose");
const { User } = require("../../models/user");
const { Order } = require("../../models/order");
require('dotenv').config({ path: '.env' });
const {prepare} = require("../setup/test-helper");


describe("Unit tests for orders API", () => {

  let config = null;
  let adminLogin = null;

  beforeAll(async () => {

    await mongoose.connect(
        process.env.DB_ENDPOINT
      );


    // Login all related users.
    const login = await axios.post(prepare("/users/login/"), {
      email: "testuserwith2boxes@test.com",
      password: "12345"
    });


    const loginUserWithNoOrders = await axios.post(prepare("/users/login/"), {
      email: "testuser2@test.com",
      password: "12345"
    });

    const {accessToken} = login.data;
    const accessTokenUserWithNoOrders = loginUserWithNoOrders.data.accessToken;

    config = {
        headers: { Authorization: `Bearer ${accessToken}` }
    };

    configUserWithNoOrders = {
        headers: { Authorization: `Bearer ${accessTokenUserWithNoOrders}` }
    };

    const invalidAccessToken = "invalidAccessToken"
    configWithInvalidAccessToken = {
        headers: { Authorization: `Bearer ${invalidAccessToken}` }
    };

    // User retrieved from the database that is currently used to be tested
    user = await User.findOne({email: "testuserwith2boxes@test.com"}).exec();
    userWithNoOrders = await User.findOne({email: "testuser2@test.com"}).exec();

    // Create two food boxes for this user
    const order1 = await new Order({
        "type": "Box1",
        "description": "First test box",
        user: user._id
      }).save();

    const order2 = await new Order({
    "type": "Box2",
    "description": "Second test box",
    user: user._id
    }).save();

  });

  it("should get correct orders for the user when these orders exist", async () => {
    const response = await axios.get(prepare("/orders"), config);
    expect(response.status).toEqual(200);
    expect(response.data.length).toEqual(2);

    response.data.forEach((order) => {
        expect(order.user).toEqual(user._id.toString());
    });

    });

    it("should return an empty list when user does not exist", async () => {
        const response = await axios.get(prepare("/orders"), configUserWithNoOrders);
        expect(response.status).toEqual(200);
        expect(response.data).toEqual([]);
    });

    it("should return error when providing trying to retrieve orders with an invalid access token", async () => {
        try {
            const response = await axios.get(prepare("/orders"), configWithInvalidAccessToken);
            expect(response.status).toEqual(403);
        } catch(error) {
            expect(error.response.status).toEqual(403);
            expect(error.response.data).toEqual({ message: "Unauthorized access." })
        }
    });

    it("should return error when trying to retrieve orders with an invalid access token", async () => {
        try {
            const response = await axios.get(prepare("/orders"), configWithInvalidAccessToken);
            expect(response.status).toEqual(403);
        } catch(error) {
            expect(error.response.status).toEqual(403);
            expect(error.response.data).toEqual({ message: "Unauthorized access." })
        }
    });

    it("should return error when trying to retrieve orders without providing an access token", async () => {
        try {
            const response = await axios.get(prepare("/orders"));
            expect(response.status).toEqual(401);
        } catch(error) {
            expect(error.response.status).toEqual(401);
            expect(error.response.data).toEqual("Unauthorized")
        }
    });

    afterAll(async () => {
        await mongoose.connection.close();
      });

});