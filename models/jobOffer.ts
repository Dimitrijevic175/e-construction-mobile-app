export interface JobOfferIn {
    job_post_id: number;
    worker_id: number;
    date_offered: string; // format "YYYY-MM-DD"
    offer_details: string;
    name: string;
    last_name: string;
    profession: string;
    email: string;
    contactInfo: string;
    starting_price: number;
}

