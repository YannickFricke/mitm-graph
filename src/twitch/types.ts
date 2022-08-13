export interface ChannelInformation {
	id: string;
	login: string;
	display_name: string;
	type: string;
	broadcaster_type: string;
	description: string;
	profile_image_url: string;
	offline_image_url: string;
	view_count: number;
	created_at: string;
}

export interface FollowRelation {
	from_id: string;
	from_login: string;
	from_name: string;

	to_id: string;
	to_login: string;
	to_name: string;

	followed_at: string;
}
