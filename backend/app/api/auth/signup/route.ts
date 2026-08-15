import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../../../lib/prisma';
import { jsonRes, handleOptions } from '../../../../lib/auth';
import { validateEmail, validatePassword, validateName, validateAddress } from '../../../../lib/validators';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key_store_rating_2026';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, address, password } = await req.json();

    if (!name || !email || !address || !password) {
      return jsonRes({ error: 'All fields are required' }, 400);
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
        role: 'NORMAL'
      }
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    return jsonRes({
      token,
      user: { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role }
    }, 201);
  } catch (error) {
    console.error('Signup error:', error);
    return jsonRes({ error: 'Internal server error' }, 500);
  }
}
