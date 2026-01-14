import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Event, EventDocument } from '@/database/event.model';

/**
 * Shape of the route parameters for this dynamic route.
 */
interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Safe helper to normalize and validate a slug string.
 */
const normalizeSlug = (value: string | undefined | null): string => {
  const slug = value?.trim();

  if (!slug) {
    throw new Error('Slug is required.');
  }

  // Slugs should be URL-friendly and not contain whitespace.
  if (/\s/.test(slug)) {
    throw new Error('Slug must not contain whitespace.');
  }

  return slug.toLowerCase();
};

/**
 * GET /api/events/[slug]
 *
 * Returns a single event by its slug.
 */
export async function GET(_request: NextRequest, context: RouteParams): Promise<NextResponse> {
  try {
    const params = await context.params;
    const slug = normalizeSlug(params.slug);

    // Ensure a single shared DB connection for the process.
    await connectToDatabase();

    // Use `lean` to return plain JSON objects rather than full Mongoose documents.
    const event: EventDocument | null = await Event.findOne({ slug })
      .lean<EventDocument>()
      .exec();

    if (!event) {
      return NextResponse.json(
        { message: 'Event not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { event },
      { status: 200 },
    );
  } catch (error: unknown) {
    // Handle known validation errors with a 400 response.
    if (error instanceof Error && error.message.includes('Slug')) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 },
      );
    }

    // Fallback for unexpected errors.
    console.error('Failed to fetch event by slug:', error);

    return NextResponse.json(
      { message: 'An unexpected error occurred while fetching the event.' },
      { status: 500 },
    );
  }
}
