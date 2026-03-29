"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = ok;
exports.err = err;
exports.isOk = isOk;
exports.isErr = isErr;
exports.paginate = paginate;
exports.generateId = generateId;
exports.sleep = sleep;
exports.retry = retry;
exports.debounce = debounce;
exports.throttle = throttle;
exports.cloneDeep = cloneDeep;
exports.merge = merge;
exports.groupBy = groupBy;
exports.unique = unique;
exports.chunk = chunk;
const uuid_1 = require("uuid");
function ok(data) {
    return { success: true, data };
}
function err(error) {
    return { success: false, error };
}
function isOk(result) {
    return result.success === true;
}
function isErr(result) {
    return result.success === false;
}
function paginate(items, total, params) {
    const totalPages = Math.ceil(total / params.pageSize);
    return {
        items,
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPreviousPage: params.page > 1,
    };
}
function generateId() {
    return (0, uuid_1.v4)();
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function retry(fn, options = {}) {
    const { maxAttempts = 3, delayMs = 1000, backoffMultiplier = 2, retryCondition = () => true, } = options;
    let lastError;
    let currentDelay = delayMs;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (attempt === maxAttempts || !retryCondition(lastError)) {
                throw lastError;
            }
            await sleep(currentDelay);
            currentDelay *= backoffMultiplier;
        }
    }
    throw lastError;
}
function debounce(fn, delayMs) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delayMs);
    };
}
function throttle(fn, limitMs) {
    let lastRun = 0;
    let timeoutId = null;
    return (...args) => {
        const now = Date.now();
        const remaining = limitMs - (now - lastRun);
        if (remaining <= 0) {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            lastRun = now;
            fn(...args);
        }
        else if (!timeoutId) {
            timeoutId = setTimeout(() => {
                lastRun = Date.now();
                timeoutId = null;
                fn(...args);
            }, remaining);
        }
    };
}
function cloneDeep(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => cloneDeep(item));
    }
    const cloned = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloned[key] = cloneDeep(obj[key]);
        }
    }
    return cloned;
}
function merge(target, source) {
    const result = { ...target };
    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            const sourceValue = source[key];
            const targetValue = result[key];
            if (isObject(sourceValue) && isObject(targetValue)) {
                result[key] = merge(targetValue, sourceValue);
            }
            else {
                result[key] = sourceValue;
            }
        }
    }
    return result;
}
function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
function groupBy(array, key) {
    return array.reduce((result, item) => {
        const groupKey = typeof key === 'function' ? key(item) : String(item[key]);
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {});
}
function unique(array, key) {
    if (!key) {
        return [...new Set(array)];
    }
    const seen = new Set();
    return array.filter((item) => {
        const value = item[key];
        if (seen.has(value)) {
            return false;
        }
        seen.add(value);
        return true;
    });
}
function chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}
//# sourceMappingURL=utils.js.map