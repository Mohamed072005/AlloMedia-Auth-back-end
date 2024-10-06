const request = require('supertest');
const app = require('../app');
const User = require('../models/user.model');
const JWTService = require('../helpers/jwt.helper');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Mock the necessary modules
jest.mock("../models/user.model");
jest.mock("../helpers/jwt.helper");

// Create a mock user for testing
const mockUser = {
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
};

// Mock User.findOne to return the mock user
User.findOne.mockResolvedValue(mockUser);

// Clear mocks after each test
afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
});

// No need to close the mongoose connection since we're not using it
afterAll(async () => {
    await mongoose.connection.close(); // Close the MongoDB connection
});

describe('POST /api/auth.router/login', () => {
    it("should return response status 200 and message registered and email sent", () => {
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
        return request(app)
            .post('/login')
            .send({
                identifier: "amin@gmail.com",
                password: 'QWERTYUIOP123qwertyuiop',
            })
            .then((response) => {
                expect(response.status).toBe(200);
                expect(response.body.user).toHaveProperty("message", "we send you email with code to virefy this new device");
            });
    });

    it("should return response status 401 and message 'Invalid login!!'", async () => {
        // Mock bcrypt.compare to simulate a password mismatch
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(false); // Simulate password mismatch

        const response = await request(app)
            .post('/login')
            .send({
                identifier: "amin@gmail.com", // Use a non-existent identifier
                password: "QWERTYUIOP123qwertyuiop",
            });

        // Check for expected response status and message
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Invalide login!!");
    });
    it("should return response status 401 and message 'Invalide identifiant'", async () => {
        // jest.spyOn(bcrypt, 'compare').mockResolvedValue(true)

        const  response = await request(app)
            .post('/login')
            .send({
                identifier: "invalideIdentifier.com",
                password: "QERTYUIOP123qwertyuiop",
            })
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("error", "Invalide identifiant");
    })

    it("should return response status 401 and message 'password is required'", async () => {
        const  response = await request(app)
        .post('/login')
        .send({
            identifier: "amine@gmail.com.com",
            password: "",
        })
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("error", "Password is required");
    })
});
