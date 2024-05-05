export default interface ApiResponse {
  data?: {
    statusCode?: number;
    isSuccess?: boolean;
    errorMessage?: Array<string>;
    result: {
      [key: string]: string;
    };
  };
  error?: any;
}
