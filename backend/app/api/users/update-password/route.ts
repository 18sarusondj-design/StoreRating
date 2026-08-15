import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '../../../../lib/prisma';
import { jsonRes, handleOptions, verifyAuthToken } from '../../../../lib/auth';
import { validatePassword } from '../../../../lib/validators';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  const { user: authUser, error } = verifyAuthToken(req);
  if (error || !authUser) {
    return jsonRes({ error: error || 'Unauthorized' }, 401);
  }

  try {
    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return jsonRes({ error: 'Old and new passwords are required' }, 400);
    }

    if (!validatePassword(newPassword)) {
      return jsonRes({ error: 'New password must be 8-16 chars, contain at least 1 uppercase and 1 special character' }, 400);
    }

    const user = await prisma.user.findUnique({ where: { id: authUser.id } });
    if (!user) {
      return jsonRes({ error: 'User not found' }, 404);
    }

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      return jsonRes({ error: 'Invalid old password' }, 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: authUser.id },
      data: { password: hashedPassword }
    });

    return jsonRes({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Update password error:', err);
    return jsonRes({ error: 'Internal server error' }, 500);
  }
}
