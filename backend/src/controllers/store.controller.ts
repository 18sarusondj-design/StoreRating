import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../prisma';
import { validateEmail, validatePassword, validateName, validateAddress } from '../utils/validators';

export const createStoreWithOwner = async (req: Request, res: Response) => {
  try {
    const { storeName, email, address, ownerName, password } = req.body;

    if (!storeName || !email || !address || !ownerName || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!validateName(ownerName)) return res.status(400).json({ error: 'Owner Name must be between 20 and 60 characters' });
    if (!validateEmail(email)) return res.status(400).json({ error: 'Invalid email format' });
    if (!validateAddress(address)) return res.status(400).json({ error: 'Address must be max 400 characters' });
    if (!validatePassword(password)) return res.status(400).json({ error: 'Password must be 8-16 chars, contain at least 1 uppercase and 1 special character' });

    // Check if user or store already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email already in use by a user' });

    const existingStore = await prisma.store.findUnique({ where: { email } });
    if (existingStore) return res.status(400).json({ error: 'Email already in use by a store' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const storeAndOwner = await prisma.$transaction(async (tx) => {
      const newOwner = await tx.user.create({
        data: {
          name: ownerName,
          email,
          address,
          password: hashedPassword,
          role: 'STORE_OWNER'
        }
      });

      const newStore = await tx.store.create({
        data: {
          name: storeName,
          email,
          address,
          ownerId: newOwner.id
        }
      });

      return { store: newStore, owner: newOwner };
    });

    res.status(201).json({ message: 'Store and Owner created successfully', store: storeAndOwner.store });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStores = async (req: Request, res: Response) => {
  try {
    const { name, address, search, sortBy, sortOrder } = req.query;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: String(search) } },
        { address: { contains: String(search) } }
      ];
    } else {
      if (name) whereClause.name = { contains: String(name) };
      if (address) whereClause.address = { contains: String(address) };
    }

    const orderByClause: any = {};
    if (sortBy) {
      const order = sortOrder === 'desc' ? 'desc' : 'asc';
      orderByClause[String(sortBy)] = order;
    }

    const stores = await prisma.store.findMany({
      where: whereClause,
      orderBy: Object.keys(orderByClause).length > 0 ? orderByClause : undefined,
      include: {
        ratings: true
      }
    });

    const storesWithRatings = stores.map(store => {
      const totalRatings = store.ratings.length;
      const averageRating = totalRatings > 0 
        ? store.ratings.reduce((acc, curr) => acc + curr.value, 0) / totalRatings 
        : 0;

      let userRating = null;
      if (userRole === 'NORMAL') {
        const userRatingObj = store.ratings.find(r => r.userId === userId);
        if (userRatingObj) {
          userRating = userRatingObj.value;
        }
      }

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating,
        totalRatings,
        ...(userRole === 'NORMAL' && { userRating })
      };
    });

    res.json(storesWithRatings);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const submitRating = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { storeId } = req.params;
    const { value } = req.body;

    if (!value || typeof value !== 'number' || value < 1 || value > 5) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
    }

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Upsert rating
    const existingRating = await prisma.rating.findUnique({
      where: { userId_storeId: { userId, storeId } }
    });

    let rating;
    if (existingRating) {
      rating = await prisma.rating.update({
        where: { id: existingRating.id },
        data: { value }
      });
    } else {
      rating = await prisma.rating.create({
        data: { value, userId, storeId }
      });
    }

    res.json({ message: 'Rating submitted successfully', rating });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStoreOwnerDashboard = async (req: Request, res: Response) => {
  try {
    const ownerId = (req as any).user.id;

    const store = await prisma.store.findUnique({
      where: { ownerId },
      include: {
        ratings: {
          include: { user: { select: { name: true, email: true } } }
        }
      }
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found for this owner' });
    }

    const totalRatings = store.ratings.length;
    const averageRating = totalRatings > 0 
      ? store.ratings.reduce((acc, curr) => acc + curr.value, 0) / totalRatings 
      : 0;

    res.json({
      store: {
        id: store.id,
        name: store.name,
        averageRating,
        totalRatings,
      },
      ratings: store.ratings.map(r => ({
        id: r.id,
        value: r.value,
        user: r.user
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
