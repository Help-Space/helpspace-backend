export type Responses<T, N = string> = NormalResponse<T> | ErrorsResponse<N> | ErrorResponse;

export interface NormalResponse<T> {
    data: T;
}

export interface ErrorsResponse<T> {
    errors: T[];
}

export interface ErrorResponse {
    message: string;
}
