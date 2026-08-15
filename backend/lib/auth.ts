import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key_store_rating_2026';

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export const handleOptions = () => {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
};

export const jsonRes = (data: any, status: number = 200) => {
  return NextResponse.json(data, {
    status,
    headers: CORS_HEADERS,
  });
};

export interface AuthPayload {
  id: string;
  role: string;
}

export const verifyAuthToken = (req: NextRequest, allowedRoles?: string[]): { user: AuthPayload | null; error: string | null } => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null, error: 'No token provided' };
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as AuthPayload;
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
      return { user: null, error: 'Unauthorized: insufficient permissions' };
    }
    return { user: decoded, error: null };
  } catch (err) {
    return { user: null, error: 'Invalid or expired token' };
  }
};
