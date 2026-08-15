import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '../../../../lib/prisma';
import { jsonRes, handleOptions } from '../../../../lib/auth';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    const existingAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (existingAdmin) {
      return jsonRes({ error: 'Admin already exists' }, 400);
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'System Administrator Super',
        email: 'admin@storerating.com',
        address: 'Admin Headquarters',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    return jsonRes({ message: 'Admin created', email: admin.email, password: 'Admin@123' }, 201);
  } catch (error) {
    console.error('Setup admin error:', error);
    return jsonRes({ error: 'Internal server error' }, 500);
  }
}
