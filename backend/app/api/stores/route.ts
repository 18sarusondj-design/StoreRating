import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '../../../lib/prisma';
import { jsonRes, handleOptions, verifyAuthToken } from '../../../lib/auth';
import { validateName, validateEmail, validateAddress, validatePassword } from '../../../lib/validators';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  const { user: authUser } = verifyAuthToken(req);

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim();
    const name = searchParams.get('name')?.trim();
    const address = searchParams.get('address')?.trim();

    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { address: { contains: search } }
      ];
    } else {
      if (name) whereClause.name = { contains: name };
      if (address) whereClause.address = { contains: address };
    }

    const stores = await prisma.store.findMany({
      where: whereClause,
      include: {
        ratings: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    const formattedStores = stores.map(store => {
      const totalRatings = store.ratings.length;
      const averageRating = totalRatings > 0
        ? store.ratings.reduce((acc, curr) => acc + curr.value, 0) / totalRatings
        : 0;

      let userRating = null;
      if (authUser) {
        const found = store.ratings.find(r => r.userId === authUser.id);
        if (found) userRating = found.value;
      }

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        ownerName: store.owner.name,
        averageRating,
        totalRatings,
        userRating
      };
    });

    return jsonRes(formattedStores);
  } catch (err) {
    console.error('Get stores error:', err);
    return jsonRes({ error: 'Internal server error' }, 500);
  }
}

export async function POST(req: NextRequest) {
  const { user: authUser, error } = verifyAuthToken(req, ['ADMIN', 'ROLE_SUPERADMIN']);
  if (error || !authUser) {
    return jsonRes({ error: error || 'Unauthorized' }, 401);
  }

  try {
    const { storeName, email, address, ownerName, password } = await req.json();

    if (!storeName || !email || !address || !ownerName || !password) {
      return jsonRes({ error: 'All fields are required' }, 400);
    }

    if (!validateName(ownerName)) return jsonRes({ error: 'Owner name must be between 20 and 60 characters' }, 400);
    if (!validateEmail(email)) return jsonRes({ error: 'Invalid email format' }, 400);
    if (!validateAddress(address)) return jsonRes({ error: 'Address must be max 400 characters' }, 400);
    if (!validatePassword(password)) return jsonRes({ error: 'Password must be 8-16 chars, contain at least 1 uppercase and 1 special character' }, 400);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return jsonRes({ error: 'Email already in use for Store Owner' }, 400);
    }

    const existingStore = await prisma.store.findUnique({ where: { email } });
    if (existingStore) {
      return jsonRes({ error: 'Store email already in use' }, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const owner = await tx.user.create({
        data: {
          name: ownerName,
          email,
          address,
          password: hashedPassword,
          role: 'STORE_OWNER'
        }
      });

      const store = await tx.store.create({
        data: {
          name: storeName,
          email,
          address,
          ownerId: owner.id
        }
      });

      return { store, owner };
    });

    return jsonRes({
      message: 'Store and Owner created successfully',
      store: result.store,
      owner: { id: result.owner.id, name: result.owner.name, email: result.owner.email, role: result.owner.role }
    }, 201);
  } catch (err) {
    console.error('Create store error:', err);
    return jsonRes({ error: 'Internal server error' }, 500);
  }
}
