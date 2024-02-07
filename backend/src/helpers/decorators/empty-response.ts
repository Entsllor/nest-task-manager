import {ApiResponse, ApiResponseOptions} from "@nestjs/swagger";

export const EmptyResponse = (options?: Omit<ApiResponseOptions, "status">) => ApiResponse({...options, status: 204});
