export interface ErrorElement {
	filed: string;
	message: string;
}

export interface ErrorResponse {
	errors?: ErrorElement[];
}
