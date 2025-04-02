// models/tokenMetadata.js
const mongoose = require('mongoose');

const tokenMetadataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

const TokenMetadata = mongoose.model('TokenMetadata', tokenMetadataSchema);

module.exports = TokenMetadata;