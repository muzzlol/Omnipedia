import mongoose, { Document, Schema } from 'mongoose';
import slugifyLib from 'slugify'; // Renamed to avoid confusion

// Interface for the Topic model for TypeScript compiler
export interface ITopic extends Document {
  name: string;
  slug: string; // URL-friendly name
  description: string;
  resources: mongoose.Types.ObjectId[];
}

// Custom slugify function
function customSlugify(topicName: string): string {
  // Configure slugify
  slugifyLib.extend({
    '#': 'sharp',
    '+': 'plus',
    '&': 'and',
    '@': 'at',
    '-': 'hyphen',
    '.': 'dot'
  });

  // Create the slug
  return slugifyLib(topicName, {
    replacement: '_',  // replace spaces with underscores
    remove: /[^A-Za-z0-9_\s#&@+.-]/g,  // remove characters that aren't in our allowed set
    lower: true,  // convert to lowercase
    strict: true,  // strip special characters except replacement
    locale: 'en'  // language code of the locale to use
  });
}

// Schema for the Topic model
const TopicSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
});

// Pre-validate middleware with proper async handling
TopicSchema.pre<ITopic>('validate', async function (next) {
  if (this.isModified('name') || !this.slug) {
    try {
      this.slug = customSlugify(this.name);
    } catch (error) {
      return next(error as Error);
    }
  }

  if (this.isNew) {
    try {
      const { generateDescription } = await import('../utils/perplexity');
      const descriptionData = await generateDescription(this.name);

      if (descriptionData.description) {
        this.description = descriptionData.description;
      } else {
        throw new Error('Description generation failed.');
      }
    } catch (error) {
      return next(error as Error);
    }
  }

  next();
});

export default mongoose.model<ITopic>('Topic', TopicSchema);
