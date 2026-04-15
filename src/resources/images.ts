import type { BulkDeleteImagesSchema } from "../../generated/model/bulkDeleteImagesSchema.ts";
import type { ImageDownloadJobCreateSchema } from "../../generated/model/imageDownloadJobCreateSchema.ts";
import type { ImageDownloadJobSchema } from "../../generated/model/imageDownloadJobSchema.ts";
import type { ImageSchema } from "../../generated/model/imageSchema.ts";
import type { StandardUploadCreateSchema } from "../../generated/model/standardUploadCreateSchema.ts";
import type { StandardUploadResponseSchema } from "../../generated/model/standardUploadResponseSchema.ts";
import { ImagesApi } from "../../generated/api/imagesApi.ts";
import type { UploadTokenCreateResponseSchema } from "../../generated/model/uploadTokenCreateResponseSchema.ts";
import {
  iteratePaginatedItems,
  iteratePaginatedResults
} from "../pagination/page-iterator.ts";
import type {
  PaginatedResult,
  PaginationRequest
} from "../pagination/types.ts";
import { putUpload } from "../uploads/put-upload.ts";
import { resolveUploadInput } from "../uploads/resolve-upload-input.ts";
import type { UploadInput } from "../uploads/types.ts";
import type { ImgwireClientOptions } from "../client/types.ts";

import { BaseResource, type ResourceContext } from "./shared.ts";

export class ImagesResource extends BaseResource {
  private readonly api: ImagesApi;

  constructor(
    private readonly clientOptions: ImgwireClientOptions,
    baseUrl: string,
    apiKey: string,
    context: ResourceContext
  ) {
    super(context);
    this.api = new ImagesApi(baseUrl);
    this.api.defaultHeaders = {
      Authorization: `Bearer ${apiKey}`
    };
  }

  bulkDelete(
    input: BulkDeleteImagesSchema
  ): Promise<Record<string, string | null>> {
    return this.unwrap("images.bulkDelete", () =>
      this.api.imagesBulkDelete(input)
    );
  }

  create(
    input: StandardUploadCreateSchema,
    options?: {
      uploadToken?: string;
    }
  ): Promise<StandardUploadResponseSchema> {
    return this.unwrap("images.create", () =>
      this.api.imagesCreate(input, options?.uploadToken)
    );
  }

  createBulkDownloadJob(
    input: ImageDownloadJobCreateSchema
  ): Promise<ImageDownloadJobSchema> {
    return this.unwrap("images.createBulkDownloadJob", () =>
      this.api.imagesCreateBulkDownloadJob(input)
    );
  }

  createUploadToken(): Promise<UploadTokenCreateResponseSchema> {
    return this.unwrap("images.createUploadToken", () =>
      this.api.imagesCreateUploadToken()
    );
  }

  delete(imageId: string): Promise<Record<string, string | null>> {
    return this.unwrap("images.delete", () => this.api.imagesDelete(imageId));
  }

  list(input?: {
    limit?: number;
    page?: number;
  }): Promise<PaginatedResult<ImageSchema>> {
    return this.unwrapPaginated("images.list", () =>
      this.api.imagesList(input?.limit, input?.page)
    );
  }

  listPages(
    input: PaginationRequest = {}
  ): AsyncGenerator<PaginatedResult<ImageSchema>, void, void> {
    return iteratePaginatedResults(
      {
        limit: input.limit,
        page: input.page ?? 1
      },
      (params) => this.list(params)
    );
  }

  listAll(
    input: PaginationRequest = {}
  ): AsyncGenerator<ImageSchema, void, void> {
    return iteratePaginatedItems(
      {
        limit: input.limit,
        page: input.page ?? 1
      },
      (params) => this.list(params)
    );
  }

  retrieve(imageId: string): Promise<ImageSchema> {
    return this.unwrap("images.retrieve", () =>
      this.api.imagesRetrieve(imageId)
    );
  }

  retrieveBulkDownloadJob(
    imageDownloadJobId: string
  ): Promise<ImageDownloadJobSchema> {
    return this.unwrap("images.retrieveBulkDownloadJob", () =>
      this.api.imagesRetrieveBulkDownloadJob(imageDownloadJobId)
    );
  }

  async upload(input: UploadInput): Promise<ImageSchema> {
    const resolved = await resolveUploadInput(input);
    const created = await this.create(
      {
        ...resolved.metadata,
        file_name: resolved.fileName,
        mime_type: resolved.mimeType
      },
      undefined
    );

    await putUpload(created.upload_url, resolved.body, {
      contentLength: resolved.contentLength,
      contentType: resolved.mimeType ? String(resolved.mimeType) : undefined,
      fetch: this.clientOptions.fetch,
      timeoutMs: this.clientOptions.timeoutMs
    });

    return created.image;
  }
}
