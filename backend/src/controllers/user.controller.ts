import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../prisma';
import { validateEmail, validatePassword, validateName, validateAddress } from '../utils/validators';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, address, password, role } = req.body;

    if (!name || !email || !address || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['NORMAL', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role for this endpoint' });
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
        role
      }
    });

    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { name, email, address, role, sortBy, sortOrder } = req.query;

    const whereClause: any = {};
    if (name) whereClause.name = { contains: String(name) };
    if (email) whereClause.email = { contains: String(email) };
    if (address) whereClause.address = { contains: String(address) };
    if (role) whereClause.role = String(role);

    const orderByClause: any = {};
    if (sortBy) {
      const order = sortOrder === 'desc' ? 'desc' : 'asc';
      orderByClause[String(sortBy)] = order;
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      orderBy: Object.keys(orderByClause).length > 0 ? orderByClause : undefined,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        ownedStore: {
          select: {
            id: true,
            name: true,
            ratings: {
              select: { value: true }
            }
          }
        }
      }
    });

    // Calculate average rating if user is STORE_OWNER
    const usersWithRatings = users.map(user => {
      let rating = null;
      if (user.role === 'STORE_OWNER' && user.ownedStore) {
        const ratings = user.ownedStore.ratings;
        if (ratings.length > 0) {
          rating = ratings.reduce((acc, curr) => acc + curr.value, 0) / ratings.length;
        }
      }
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        rating
      };
    });

    res.json(usersWithRatings);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Old and new passwords are required' });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({ error: 'New password must be 8-16 chars, contain at least 1 uppercase and 1 special character' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid old password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
