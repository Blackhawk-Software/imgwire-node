export * from './corsOriginsApi';
import { CorsOriginsApi } from './corsOriginsApi';
export * from './customDomainApi';
import { CustomDomainApi } from './customDomainApi';
export * from './imagesApi';
import { ImagesApi } from './imagesApi';
export * from './metricsApi';
import { MetricsApi } from './metricsApi';
import * as http from 'http';

export class HttpError extends Error {
    constructor (public response: http.IncomingMessage, public body: any, public statusCode?: number) {
        super('HTTP request failed');
        this.name = 'HttpError';
    }
}

export type { RequestFile } from '../model/models';

export const APIS = [CorsOriginsApi, CustomDomainApi, ImagesApi, MetricsApi];
