
const axios = require("axios");
const mongoose = require("mongoose");
const { User } = require("../../models/user");
const { Order } = require("../../models/order");
require('dotenv').config({ path: '.env' });

describe("Order Model Tests.", () => {
    const testUser = {
        "name": "Admin2",
        "role": "Admin",
        "email": "user_test_1@test.com",
        "password": "12345",
        "address": "Somewhere 10"
      }

  beforeAll(async () => {
    await mongoose.connect(
      process.env.DB_ENDPOINT
    );
  });

  /////// START OF MY IMPLEMENTATION /////

  beforeEach(async () => {
    // Remove all existing Order documents before each test
    await Order.deleteMany({});
  });

  

  /* TEST IDEAS

    ------Test that the Order model can be successfully created and saved to the database.
    ------Test that the type field of the Order model is set to the default value of 'Box1' when no value is provided.
    ------Test that the type field of the Order model only accepts the specified enum values of 'Box1' and 'Box2'
    ------Test that the user field of the Order model is not a required field
    ------Test that the description field of the Order model is not a required field
    ------Test that the type field is set correctly and returns the correct value when queried:
    ------Test that the description field is set correctly and returns the correct value when queried:
    ------Test that the user field is set correctly and returns the correct value when queried:
    Test that the user field of the Order model is correctly referenced to the User model
    Test that trying to save an Order model with an invalid user field value returns an error
    Test that trying to save an Order model with an invalid type field value returns an error


    FOR ERROR HANDLING

    Test that trying to create an Order model with invalid data returns an error
    Test that trying to save an Order model with missing required fields returns an error
    -----Test that trying to find an non-existing Order model returns null
    -----Test that trying to update an non-existing Order model returns null
    -----Test that trying to delete an non-existing Order model returns null
  */

    it("should be able to create and save an Order to the database", async () => {
        const order = new Order({
            type: "Box1",
            description: "Test Order",
        });

        await order.save();

        const foundOrder = await Order.findOne({ type: "Box1" });
        expect(foundOrder.description).toEqual("Test Order");
    });

    it("should have type field set to the default value of 'Box1' when no value is provided", async () => {
        const newOrder = new Order({description: "Test order"});
        await newOrder.save();
        const orderFromDb = await Order.findById(newOrder._id);
        expect(orderFromDb.type).toBe("Box1");
    });

    it("test that the type field of the Order model only accepts the specified enum values of 'Box1' and 'Box2'", async () => {
        const validOrder1 = new Order({
            type: 'Box1',
            description: "Test Order"
          });

        await expect(validOrder1.save()).resolves.toBeTruthy();

        const validOrder2 = new Order({
            type: 'Box2',
            description: "Test Order"
          });
          
        await expect(validOrder2.save()).resolves.toBeTruthy();
    
        const invalidOrder1 = new Order({
        type: 'InvalidType',
        description: "Test Order"
        });
        await expect(invalidOrder1.save()).rejects.toThrow();
    
        const invalidOrder2 = new Order({
        type: '',
        description: "Test Order"
        });
        await expect(invalidOrder2.save()).rejects.toThrow();
    });

    it("should not require a user field", async () => {
        const newOrder = new Order({
            type: "Box1",
            description: "This is a test order"
        });
        const savedOrder = await newOrder.save();
        expect(savedOrder._id).toBeDefined();
    });

    it("should not require a description field", async () => {
        const newOrder = new Order({
            type: "Box1"
        });
        const savedOrder = await newOrder.save();
        expect(savedOrder._id).toBeDefined();
    });


    // it("should correctly reference the User model", async () => {
    //     const newUser = new User(testUser);
    //     await newUser.save();

    //     const newOrder = new Order({
    //         type: "Box1",
    //         user: newUser._id
    //     });
    //     const savedOrder = await newOrder.save();

    //     expect(savedOrder.user.toString()).toBe(newUser._id.toString());
    //     await User.deleteOne({_id: newUser._id});
    // });

    it("should return the correct value for the type field if set correclty", async () => {
        const order = new Order({ type: "Box2" });
        await order.save();
        const savedOrder = await Order.findById(order._id);
        expect(savedOrder.type).toBe("Box2");
    });

    it("should return the correct value for the description field if set correclty", async () => {
        const order = new Order({ description: "Test Description" });
        await order.save();
        const savedOrder = await Order.findById(order._id);
        expect(savedOrder.description).toBe("Test Description");
    });

    it("should return the correct value for the user field if set correclty", async () => {
        const userData = {
            "name": "Admin2",
            "role": "Admin",
            "email": "user_test_3@test.com",
            "password": "12345",
            "address": "Somewhere 10"
          }

        const user = new User(userData);
        await user.save();
        const order = new Order({ user: user._id });
        await order.save();
        const savedOrder = await Order.findById(order._id);
        expect(savedOrder.user.toString()).toBe(user._id.toString());

        await User.deleteOne({_id: user._id});

    });
    
    const unexistingOrderId = '1f637a4d4f3a4e1b1c8e5d5e'

    
    // Error handling
    it("should return null when trying to find a non-existing Order", async () => {
        const order = await Order.findOne({ _id:  unexistingOrderId});
        expect(order).toBeNull();
    });

    it("should return null when trying to update a non-existing Order", async () => {
        const order = await Order.findOneAndUpdate({ _id: unexistingOrderId }, { type: 'Box2' }, { new: true });
        expect(order).toBeNull();
    });

    it("should return null when trying to delete a non-existing Order", async () => {
        const order = await Order.findOneAndDelete({ _id: unexistingOrderId });
        expect(order).toBeNull();
    });

    





  afterAll(async () => {
    await mongoose.connection.close();
  });
  
});