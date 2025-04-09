const axios = require('axios');
const { Supervisor, District } = require('../models/supervisor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// SSLCommerz configuration
const SSLCommerzConfig = {
    store_id: 'your_store_id',
    store_passwd: 'your_store_password',
    isSandbox: true
};

// Create a new supervisor
exports.createSupervisor = async (req, res) => {
    try {
        const { fullname, email, phone, address, gender, district, union, birthdate, NIDCard, experience, password } = req.body;

        if (!fullname || !email || !phone || !address || !gender || !district || !union || !birthdate || !NIDCard || experience === undefined || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const districtData = await District.findOne({ name: district.name });
        if (!districtData) {
            return res.status(404).json({ message: 'District not found' });
        }

        const validUnions = districtData.unions.map(u => u.name);
        if (!validUnions.includes(union)) {
            return res.status(400).json({ message: `Invalid union: ${union}` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const creatingSupervisor = new Supervisor({
            fullname,
            email,
            phone,
            address,
            gender,
            district: districtData._id, // store ObjectId reference
            union,
            birthdate,
            NIDCard,
            experience,
            password: hashedPassword
        });

        await creatingSupervisor.save();

        res.status(201).json({
            message: 'Supervisor created successfully',
            supervisor: creatingSupervisor
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Duplicate field value', error });
        }
        res.status(500).json({ message: 'Error creating supervisor', error });
    }
};
// Get all districts
exports.getDistricts = async (req, res) => {
    try {
        try {
            const districts = await District.find();
            res.status(200).json({ districts });
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving districts', error });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving districts', error });
    }
};


// JWT secret key
const JWT_SECRET = 'your_jwt_secret_key';

// Login controller
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const supervisor = await Supervisor.findOne({ email });
        if (!supervisor) {
            return res.status(404).json({ message: 'Supervisor not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, supervisor.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: supervisor._id, email: supervisor.email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            token,
            supervisor: {
                id: supervisor._id,
                fullname: supervisor.fullname,
                email: supervisor.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

// Get supervisor by email
exports.getSupervisorByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const supervisor = await Supervisor.findOne({ email });
        if (!supervisor) {
            return res.status(404).json({ message: 'Supervisor not found' });
        }

        res.status(200).json({ supervisor });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving supervisor', error });
    }
};

// Update supervisor by email
exports.updateSupervisorByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const updateData = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // If district or union is being updated, validate them
        if (updateData.district || updateData.union) {
            const districtData = await District.findOne({ name: updateData.district.name });
            if (!districtData) {
                return res.status(404).json({ message: 'District not found' });
            }

            const validUnions = districtData.unions.map(u => u.name);
            if (updateData.union && !validUnions.includes(updateData.union)) {
                return res.status(400).json({ message: `Invalid union: ${updateData.union}` });
            }

            updateData.district = districtData._id;
        }


        const updatedSupervisor = await Supervisor.findOneAndUpdate(
            { email },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedSupervisor) {
            return res.status(404).json({ message: 'Supervisor not found' });
        }

        res.status(200).json({
            message: 'Supervisor updated successfully',
            supervisor: updatedSupervisor
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating supervisor', error });
    }
};
