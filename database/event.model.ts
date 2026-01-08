import { Schema, model, models, Document, Model } from 'mongoose';

/**
 * Event attributes that can be provided when creating a new Event.
 * `createdAt` and `updatedAt` are managed by Mongoose timestamps.
 */
export interface EventAttrs {
  title: string;
  slug?: string; // Generated automatically if not provided
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // Stored as ISO date string (YYYY-MM-DD)
  time: string; // Stored as 24h time string (HH:mm)
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
}

/**
 * Event document as stored in MongoDB.
 */
export interface EventDocument extends EventAttrs, Document {
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Event model type to enable type-safe static helpers if needed later.
 */
export type EventModel = Model<EventDocument>;

/**
 * Basic slugify helper to generate URL-friendly slugs from titles.
 * Throws if the result would be empty (e.g., title contains only non-alphanumeric characters).
 */
const slugify = (value: string): string => {
  const slug = value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with dashes
    .replace(/^-+|-+$/g, ''); // trim leading/trailing dashes
  
  if (!slug) {
    throw new Error('Title must contain at least one alphanumeric character to generate a valid slug.');
  }
  
  return slug;
};

/**
 * Normalizes a date string to an ISO date-only format (YYYY-MM-DD).
 * Accepts YYYY-MM-DD format and validates it; parses as UTC to avoid timezone shifts.
 * Throws if the input is not in valid YYYY-MM-DD format or the date is invalid.
 */
const normalizeDate = (value: string): string => {
  const trimmed = value.trim();
  const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
  const match = trimmed.match(dateRegex);

  if (!match) {
    throw new Error('Invalid event date; expected YYYY-MM-DD format.');
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  // Validate month and day ranges
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    throw new Error('Invalid event date; month must be 1-12 and day 1-31.');
  }

  // Create date using Date.UTC to ensure UTC parsing
  const utcDate = new Date(Date.UTC(year, month - 1, day));

  if (Number.isNaN(utcDate.getTime())) {
    throw new Error('Invalid event date; the date is not valid.');
  }

  // Return the date as YYYY-MM-DD
  return trimmed;
};

/**
 * Normalizes a time string into 24-hour HH:mm format.
 * Accepts inputs like "9:00", "09:00", "21:30".
 */
const normalizeTime = (value: string): string => {
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})$/);

  if (!match) {
    throw new Error('Invalid event time; expected HH:mm in 24-hour format.');
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error('Invalid event time; hour must be 0-23 and minute 0-59.');
  }

  const hh = hours.toString().padStart(2, '0');
  const mm = minutes.toString().padStart(2, '0');

  return `${hh}:${mm}`;
};

/**
 * Helper for validating required non-empty strings.
 */
const requiredString = {
  type: String,
  required: true as const,
  trim: true,
  validate: {
    validator: (value: string): boolean => value.trim().length > 0,
    message: 'Field is required and cannot be empty.',
  },
};

const EventSchema = new Schema<EventDocument, EventModel>(
  {
    title: requiredString,
    slug: {
      type: String,
      unique: true,
      index: true,
      trim: true,
    },
    description: requiredString,
    overview: requiredString,
    image: requiredString,
    venue: requiredString,
    location: requiredString,
    date: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    mode: requiredString,
    audience: requiredString,
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]): boolean =>
          Array.isArray(value) &&
          value.length > 0 &&
          value.every((item) => typeof item === 'string' && item.trim().length > 0),
        message: 'Agenda must be a non-empty array of non-empty strings.',
      },
    },
    organizer: requiredString,
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]): boolean =>
          Array.isArray(value) &&
          value.length > 0 &&
          value.every((item) => typeof item === 'string' && item.trim().length > 0),
        message: 'Tags must be a non-empty array of non-empty strings.',
      },
    },
  },
  {
    timestamps: true, // automatically manages createdAt and updatedAt
    collection: 'events',
  },
);

// Ensure slug is unique at the database level.
EventSchema.index({ slug: 1 }, { unique: true });

/**
 * Pre-save hook for:
 * - Generating a URL-friendly slug from the title (only when the title changes).
 *   If a collision is detected, appends a counter or timestamp suffix until unique.
 * - Normalizing date to ISO (YYYY-MM-DD).
 * - Normalizing time to 24-hour HH:mm format.
 */
EventSchema.pre<EventDocument>('save', async function preSave(next) {
  try {
    if (this.isModified('title')) {
      const baseSlug = slugify(this.title);
      let slug = baseSlug;
      let counter = 1;

      // Check if slug already exists (excluding current document)
      while (
        await (this.constructor as EventModel).exists({
          slug,
          _id: { $ne: this._id },
        })
      ) {
        // Append counter to make slug unique
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      this.slug = slug;
    }

    if (this.isModified('date')) {
      this.date = normalizeDate(this.date);
    }

    if (this.isModified('time')) {
      this.time = normalizeTime(this.time);
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

/**
 * Event model. Reuses an existing compiled model in dev to avoid OverwriteModelError.
 */
export const Event: EventModel = (models.Event as EventModel) || model<EventDocument, EventModel>('Event', EventSchema);

export default Event;
