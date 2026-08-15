import { NextRequest } from 'next/server';
import prisma from '../../../../lib/prisma';
import { jsonRes, handleOptions, verifyAuthToken } from '../../../../lib/auth';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  const { user: authUser, error } = verifyAuthToken(req, ['ADMIN', 'ROLE_SUPERADMIN']);
  if (error || !authUser) {
    return jsonRes({ error: error || 'Unauthorized' }, 401);
  }

  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

    return jsonRes({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    return jsonRes({ error: 'Internal server error' }, 500);
  }
}
