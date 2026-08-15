import { NextRequest } from 'next/server';
import prisma from '../../../../lib/prisma';
import { jsonRes, handleOptions, verifyAuthToken } from '../../../../lib/auth';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  const { user: authUser, error } = verifyAuthToken(req, ['STORE_OWNER']);
  if (error || !authUser) {
    return jsonRes({ error: error || 'Unauthorized' }, 401);
  }

  try {
    const store = await prisma.store.findUnique({
      where: { ownerId: authUser.id },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!store) {
      return jsonRes({ error: 'No store associated with this account' }, 404);
    }

    const totalRatings = store.ratings.length;
    const averageRating = totalRatings > 0
      ? store.ratings.reduce((acc, curr) => acc + curr.value, 0) / totalRatings
      : 0;

    const formattedRatings = store.ratings.map(r => ({
      id: r.id,
      userName: r.user.name,
      userEmail: r.user.email,
      rating: r.value,
      createdAt: r.createdAt
    }));

    return jsonRes({
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      averageRating,
      totalRatings,
      ratings: formattedRatings
    });
  } catch (err) {
    console.error('Get owner store error:', err);
    return jsonRes({ error: 'Internal server error' }, 500);
  }
}
