import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { validateEmail, validatePassword, validateName, validateAddress } from '../utils/validators';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key_store_rating_2026';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, address, password } = req.body;

    if (!name || !email || !address || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!validateName(name)) return res.status(400).json({ error: 'Name must be between 20 and 60 characters' });
    if (!validateEmail(email)) return res.status(400).json({ error: 'Invalid email format' });
    if (!validateAddress(address)) return res.status(400).json({ error: 'Address must be max 400 characters' });
    if (!validatePassword(password)) return res.status(400).json({ error: 'Password must be 8-16 chars, contain at least 1 uppercase and 1 special character' });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        address,
        password: hashedPassword,
        role: 'NORMAL'
      }
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const setupInitialAdmin = async (req: Request, res: Response) => {
  try {
    const existingAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'System Administrator Super', // 28 chars
        email: 'admin@storerating.com',
        address: 'Admin Headquarters',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    res.status(201).json({ message: 'Admin created', email: admin.email, password: 'Admin@123' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
