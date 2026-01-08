import { Schema, model, models, Document, Model, Types } from 'mongoose';
import { Event } from './event.model';

/**
 * Booking attributes that can be provided when creating a new Booking.
 */
export interface BookingAttrs {
  eventId: Types.ObjectId;
  email: string;
}

/**
 * Booking document as stored in MongoDB.
 */
export interface BookingDocument extends BookingAttrs, Document {
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Booking model type.
 */
export type BookingModel = Model<BookingDocument>;

/**
 * Simple email format validation (sufficient for most application use cases).
 */
const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema<BookingDocument, BookingModel>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true, // index for faster lookups by event
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string): boolean => emailRegex.test(value),
        message: 'Invalid email format.',
      },
    },
  },
  {
    timestamps: true, // automatically manages createdAt and updatedAt
    collection: 'bookings',
  },
);

/**
 * Pre-save hook to:
 * - Ensure the referenced event exists before creating a booking.
 */
BookingSchema.pre<BookingDocument>('save', async function preSave(next) {
  try {
    if (!this.isModified('eventId')) {
      return next();
    }

    const eventExists = await Event.exists({ _id: this.eventId }).lean().exec();

    if (!eventExists) {
      return next(new Error('Cannot create booking: referenced event does not exist.'));
    }

    return next();
  } catch (error) {
    return next(error as Error);
  }
});

/**
 * Booking model. Reuses an existing compiled model in dev to avoid OverwriteModelError.
 */
export const Booking: BookingModel =
  (models.Booking as BookingModel) || model<BookingDocument, BookingModel>('Booking', BookingSchema);

export default Booking;
