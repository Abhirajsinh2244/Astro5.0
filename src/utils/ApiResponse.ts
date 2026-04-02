export class ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    timestamp: string;

    constructor(success: boolean, data?: T, error?: string) {
        this.success = success;
        if (data) this.data = data;
        if (error) this.error = error;
        this.timestamp = new Date().toISOString();
    }
}