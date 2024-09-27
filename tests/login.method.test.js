const request = require('supertest');
const app = require('../app');
const User = require('../models/user.model');
const JWTService = require('../helpers/jwt.helper');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Mock the necessary modules
// jest.mock("../models/user.model");
// jest.mock("../helpers/jwt.helper");

describe('POST /api/auth.router/login', () => {
    // afterAll(async () => {
    //     await mongoose.connection.close(); // Close the MongoDB connection
    // });

    // afterEach(() => {
    //     jest.clearAllMocks(); // Clear mocks after each test
    // });

    beforeALL(async () => {
        await request(app).post("/login").send({
            _id: '66f5bf1b02e9e47d81eeaba0',
            full_name: 'Haouat Amine',
            user_name: 'Haouat24',
            email: 'amine072005@gmail.com',
            password: 'QWERTYUIOP123qwertyuiop',
            phone_number: '6720400096',
            country: 'Morocco',
            city: 'Khouribga',
            address: 'lot al amane',
            role: 'client',

            verified: false,
            createdAt: '2024-09-26T20:07:55.165Z',
            updatedAt: '2024-09-26T20:07:55.165Z',
        })
    })

    it("should return response status 200 and message registered and email sended", async () => {
        const response = await request(app)
            .post('/login')
            .send({
             identifier: "amin@gmail.com", // Use a non-existent identifier
                password: "QWERTYUIOP123qwertyuiop",
            });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "Login success");
            // expect(response.body).toHaveProperty("user")
    });


    it("should return response status 401 and message invalide login", async () => {

        // User.findOne.mockResolvedValue(user); // Simulate finding a user
        // jest.spyOn(bcrypt, 'compare').mockResolvedValue(false); // Simulate password mismatch

        const response = await request(app)
            .post('/login')
            .send({
             identifier: "amin@gmail.com", // Use a non-existent identifier
                password: "QWERTYUIOP123qwertyuiop",
            });
    
            console.log(response.body);
            
         // Check for expected response status and message
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Invalide login!!");
    });
});
