export interface JobPostIn {
    title: string;
    description: string;
    client_id: number;
    address: string;
    date_posted: string; // format "YYYY-MM-DD"
}