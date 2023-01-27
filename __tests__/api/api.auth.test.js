
const axios = require("axios");
const mongoose = require("mongoose");
const { User } = require("../../models/user");
const { Order } = require("../../models/order");
require('dotenv').config({ path: '.env' });
const {prepare} = require("../setup/test-helper");
const { authenticateToken } = require('../../endpoints/auth');
const jwt = require("jsonwebtoken");



describe("Unit tests for User Auth module", () => {

  let config = null;


  beforeAll(async () => {

    await mongoose.connect(
        process.env.DB_ENDPOINT
      );

    // Login all related users.
    // const login = await axios.post(prepare("/users/login/"), {
    //   email: "testuserwith2boxes@test.com",
    //   password: "12345"
    // });

    // const {accessToken} = login.data;

    // config = {
    //     headers: { authorization: `Bearer ${accessToken}` }
    // };
  });

    it("returns 401 when token is null or undefined", () => {
        // Create a mock request object with a null token
        const req = {
            headers: {
                authorization: null
            }
        }

        // Create a mock response object
        const res = {
            sendStatus: jest.fn()
        }

        // Call the authenticateToken function
        authenticateToken(req, res);

        // Expect the sendStatus function to have been called with 401
        expect(res.sendStatus).toHaveBeenCalledWith(401);
    });

    it("returns 403 when token is invalid", () => {
        const req = {headers: {'authorization': 'Bearer invalid_token'}};
        const res = {
        statusCode: null,
        status: function(code) {
            this.statusCode = code;
            return this;
        },
        send: function(message) {}
        };
        const next = jest.fn();

        authenticateToken(req, res, next);

        expect(res.statusCode).toBe(403);
    })

    it('extracts the user ID from the token and finds the corresponding user in the database', async () => {
        // Find a dummy user in the database
        const dummyUser = await User.findOne({email: "testuserwith2boxes@test.com"}).exec();

        // Sign a token with the dummy user's ID
        const token = jwt.sign({ id: dummyUser._id }, process.env.API_SECRET);

        // Create a dummy request object with the token in the headers
        const req = { headers: { authorization: `Bearer ${token}` } };

        // Create a dummy response object
        const res = {};
        await new Promise((resolve,reject)=>{
            authenticateToken(req, res, () => {
                resolve()
            });
        });

        expect(req.user.id).toEqual(dummyUser.id);
      });

    afterAll(async () => {
        await mongoose.connection.close();
      });
});