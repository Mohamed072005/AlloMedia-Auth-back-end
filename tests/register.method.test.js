const request = require('supertest');
const app = require('../app');
const User = require('../models/user.model');
const mongoose = require('mongoose');
const { register } = require('../services/user.services');
const { generateJWT } = require('../helpers/jwt.helper');

// Mock the necessary modules
jest.mock('../models/user.model', () => ({
    create: jest.fn(),
}));
jest.mock('../helpers/jwt.helper');
jest.mock('../services/user.services');

let req, res;

// Create a mock user for testing registration
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
};

beforeEach(() => {
    req = { body: {} };
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
});

// Clear mocks after each test
afterEach(() => {
    jest.clearAllMocks();
});

// Close the mongoose connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});

describe('POST /api/auth/register', () => {
    it("should return status 200 and a message 'registered and email sended' on successful registration", async () => {
        const userAgent = 'testing_agent';

        // Mock the register function to return the mock user
        register.mockResolvedValue(mockUser);
        generateJWT.mockReturnValue('Token');

        const response = await request(app)
            .post('/register')
            .set('User-Agent', userAgent)
            .send({
                full_name: 'Haouat Amine',
                user_name: 'Haouat24',
                email: 'amine072005@gmail.com',
                password: 'QWERTYUIOP123qwertyuiop',
                phone_number: '6720400096',
                country: 'Morocco',
                city: 'Khouribga',
                address: 'lot al amane',
            });

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'registered and email sended');
        // expect(response.body).toHaveProperty('user', mockUser);
        // expect(User.create).toHaveBeenCalledWith(expect.any(Object));
        // expect(generateJWT).toHaveBeenCalledWith(mockUser.email, '1800s');
    });

    it("should return status 400 and an error 'user doesn’t created!' if the registration fails", async () => {
        // Mock register function to return null, simulating a failure
        register.mockResolvedValue(null);

        const response = await request(app)
            .post('/register')
            .send({
                full_name: 'Haouat Amine',
                user_name: 'Haouat24',
                email: 'amine072005@gmail.com',
                password: 'QWERTYUIOP123qwertyuiop',
                phone_number: '6720400096',
                country: 'Morocco',
                city: 'Khouribga',
                address: 'lot al amane',
            });

        // Assertions
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'user doesn\'t created!');
    });

    it("should return status 401 and an error 'Password is required' if no password is provided", async () => {
        const response = await request(app)
            .post('/register')
            .send({
                full_name: 'Haouat Amine',
                user_name: 'Haouat24',
                email: 'amine072005@gmail.com',
                phone_number: '6720400096',
                country: 'Morocco',
                city: 'Khouribga',
                address: 'lot al amane',
                password: '', // No password provided
            });

        // Assertions
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error', 'Password is required');
    });

    it("should return status 401 and an error 'Please provide a valid email address' if an invalid email is provided", async () => {
        const response = await request(app)
            .post('/register')
            .send({
                full_name: 'Haouat Amine',
                user_name: 'Haouat24',
                email: 'invalidemail.com', // Invalid email format
                password: 'QWERTYUIOP123qwertyuiop',
                phone_number: '6720401096',
                country: 'Morocco',
                city: 'Khouribga',
                address: 'lot al amane',
            });

        // Assertions
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error', 'Please provide a valid email address');
    });
});
