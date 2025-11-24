import { NextRequest, NextResponse } from 'next/server';

// URL của Java Backend
const JAVA_API_URL = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Gọi sang Java
    const res = await fetch(`${JAVA_API_URL}/api/bookmarks/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token, // Chuyển tiếp Token
      },
    });

    if (!res.ok) {
        throw new Error(`Java Backend error: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Proxy Error [Bookmarks My]:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}