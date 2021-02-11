"use strict";

const mongoose = require("mongoose");
const { createEncryptedPasscode } = require("../utils/auth-utils");

const Schema = mongoose.Schema;

/**
 * Auth Schema
 */
const AuthSchema = new Schema({
    passcode: { type: String, default: "", trim: true, maxlength: 100 },
    createdAt: { type: Date, default: Date.now },
});

/**
 * Validations
 */

/**
 * Pre-remove hook
 */

/**
 * Methods
 */
AuthSchema.methods = {
    create: function() {
        this.passcode = createEncryptedPasscode();
        return this.save();
    }
};

module.exports = {
    AuthSchema,
};
