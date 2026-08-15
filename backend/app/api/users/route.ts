import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '../../../lib/prisma';
import { jsonRes, handleOptions, verifyAuthToken } from '../../../lib/auth';
import { validateName, validateEmail, validateAddress, validatePassword } from '../../../lib/validators';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  const { user: authUser, error } = verifyAuthToken(req, ['ADMIN', 'ROLE_SUPERADMIN']);
  if (error || !authUser) {
    return jsonRes({ error: error || 'Unauthorized' }, 401);
  }

  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const address = searchParams.get('address');
    const role = searchParams.get('role');
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');

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

    const usersWithRatings = users.map(u => {
      let rating = null;
      if (u.role === 'STORE_OWNER' && u.ownedStore) {
        const ratings = u.ownedStore.ratings;
        if (ratings.length > 0) {
          rating = ratings.reduce((acc, curr) => acc + curr.value, 0) / ratings.length;
        }
      }
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        address: u.address,
        role: u.role,
        rating
      };
    });

    return jsonRes(usersWithRatings);
  } catch (err) {
    console.error('Get users error:', err);
    return jsonRes({ error: 'Internal server error' }, 500);
  }
}

export async function POST(req: NextRequest) {
  const { user: authUser, error } = verifyAuthToken(req, ['ADMIN', 'ROLE_SUPERADMIN']);
  if (error || !authUser) {
    return jsonRes({ error: error || 'Unauthorized' }, 401);
  }

  try {
    const { name, email, address, password, role } = await req.json();

    if (!name || !email || !address || !password || !role) {
      return jsonRes({ error: 'All fields are required' }, 400);
    }

    if (!['NORMAL', 'ADMIN'].includes(role)) {
      return jsonRes({ error: 'Invalid role for this endpoint' }, 400);
    }

    if (!validateName(name)) return jsonRes({ error: 'Name must be between 20 and 60 characters' }, 400);
    if (!validateEmail(email)) return jsonRes({ error: 'Invalid email format' }, 400);
    if (!validateAddress(address)) return jsonRes({ error: 'Address must be max 400 characters' }, 400);
    if (!validatePassword(password)) return jsonRes({ error: 'Password must be 8-16 chars, contain at least 1 uppercase and 1 special character' }, 400);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return jsonRes({ error: 'Email already in use' }, 400);
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

    return jsonRes({ user: { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role } }, 201);
  } catch (err) {
    console.error('Create user error:', err);
    return jsonRes({ error: 'Internal server error' }, 500);
  }
}
