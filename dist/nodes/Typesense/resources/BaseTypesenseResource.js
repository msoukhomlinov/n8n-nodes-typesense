"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTypesenseResource = void 0;
class BaseTypesenseResource {
    constructor(resourceName) {
        this.resourceName = resourceName;
    }
    /**
     * Get the resource name
     */
    getResourceName() {
        return this.resourceName;
    }
    /**
     * Helper method to validate required parameters
     */
    validateRequired(context, parameterName, itemIndex) {
        const value = context.getNodeParameter(parameterName, itemIndex);
        if (!value) {
            throw new Error(`${parameterName} is required`);
        }
        return value;
    }
    /**
     * Helper method to get optional parameters with default
     */
    getOptional(context, parameterName, itemIndex, defaultValue = undefined) {
        return context.getNodeParameter(parameterName, itemIndex, defaultValue);
    }
    /**
     * Helper method to handle boolean parameters
     */
    getBoolean(context, parameterName, itemIndex, defaultValue = false) {
        return context.getNodeParameter(parameterName, itemIndex, defaultValue);
    }
    /**
     * Helper method to handle number parameters
     */
    getNumber(context, parameterName, itemIndex, defaultValue = 0) {
        return context.getNodeParameter(parameterName, itemIndex, defaultValue);
    }
    /**
     * Helper method to handle array parameters
     */
    getArray(context, parameterName, itemIndex, defaultValue = []) {
        const value = context.getNodeParameter(parameterName, itemIndex, defaultValue);
        return Array.isArray(value) ? value : defaultValue;
    }
    /**
     * Helper method to handle object parameters
     */
    getObject(context, parameterName, itemIndex, defaultValue = {}) {
        return context.getNodeParameter(parameterName, itemIndex, defaultValue);
    }
}
exports.BaseTypesenseResource = BaseTypesenseResource;
