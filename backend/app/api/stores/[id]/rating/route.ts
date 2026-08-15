import { NextRequest } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { jsonRes, handleOptions, verifyAuthToken } from '../../../../../lib/auth';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { user: authUser, error } = verifyAuthToken(req, ['NORMAL', 'ADMIN', 'ROLE_SUPERADMIN']);
  if (error || !authUser) {
    return jsonRes({ error: error || 'Unauthorized' }, 401);
  }

  try {
    const storeId = params.id;
    const { value } = await req.json();

    if (!value || typeof value !== 'number' || value < 1 || value > 5) {
      return jsonRes({ error: 'Rating value must be an integer between 1 and 5' }, 400);
    }

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      return jsonRes({ error: 'Store not found' }, 404);
    }

    const rating = await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId: authUser.id,
          storeId
        }
      },
      update: { value },
      create: {
        userId: authUser.id,
        storeId,
        value
      }
    });

    return jsonRes({ message: 'Rating submitted successfully', rating });
  } catch (err) {
    console.error('Submit rating error:', err);
    return jsonRes({ error: 'Internal server error' }, 500);
  }
}
