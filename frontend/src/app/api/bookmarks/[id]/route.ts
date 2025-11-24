import { NextRequest, NextResponse } from 'next/server';

const JAVA_API_URL = process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:8080';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const scholarshipId = params.id;
    const token = request.headers.get('authorization');

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Gọi sang Java: POST /api/bookmarks/{id}
    const res = await fetch(`${JAVA_API_URL}/api/bookmarks/${scholarshipId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });

    if (!res.ok) {
        throw new Error(`Java Backend error: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Proxy Error [Bookmark Toggle]:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}