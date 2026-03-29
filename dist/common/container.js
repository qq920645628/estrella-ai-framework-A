"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const logger_1 = require("@common/logger");
class Container {
    constructor() {
        this.services = new Map();
        this.logger = (0, logger_1.createLogger)('ServiceContainer');
    }
    static getInstance() {
        if (!Container.instance) {
            Container.instance = new Container();
        }
        return Container.instance;
    }
    register(name, service) {
        if (this.services.has(name)) {
            this.logger.warn(`Service ${name} already registered, overwriting`);
        }
        this.services.set(name, service);
        this.logger.debug(`Registered service: ${name}`);
    }
    get(name) {
        return this.services.get(name);
    }
    has(name) {
        return this.services.has(name);
    }
    async initialize() {
        this.logger.info('Initializing service container...');
    }
    async shutdown() {
        this.logger.info('Shutting down service container...');
        this.services.clear();
    }
}
exports.container = Container.getInstance();
exports.default = Container;
//# sourceMappingURL=container.js.map