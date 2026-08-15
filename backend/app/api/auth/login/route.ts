import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../../../lib/prisma';
import { jsonRes, handleOptions } from '../../../../lib/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key_store_rating_2026';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return jsonRes({ error: 'Email and password are required' }, 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return jsonRes({ error: 'Invalid credentials' }, 401);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return jsonRes({ error: 'Invalid credentials' }, 401);
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    return jsonRes({
      token,
      user: { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    return jsonRes({ error: 'Internal server error' }, 500);
  }
}
