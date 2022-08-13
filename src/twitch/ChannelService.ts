import { inject, injectable } from 'inversify';
import { Logger } from 'tslog';
import { Identifiers } from '../ioc/Identifiers';
import { HTTPClient } from '../types';
import { TwitchToken } from './token';
import { ChannelInformation, FollowRelation } from './types';

@injectable()
export class ChannelService {
	constructor(
		@inject(Logger)
		private readonly logger: Logger,

		@inject(Identifiers.HTTPClient)
		private readonly http_client: HTTPClient,
	) {}

	public async get_channel_by_name(
		channel_name: string,
	): Promise<[ChannelInformation]> {
		const url = `https://api.twitch.tv/helix/users?login=${channel_name}`;
		const response = await this.http_client.get(url);

		return response.data.data;
	}

	public async get_channel_by_id(
		channel_id: string,
	): Promise<[ChannelInformation]> {
		const url = `https://api.twitch.tv/helix/users?id=${channel_id}`;
		const response = await this.http_client.get(url);

		return response.data.data;
	}

	public async get_channel_data_by_names(
		channel_names: string[],
	): Promise<{ data: ChannelInformation[] }> {
		const url = `https://api.twitch.tv/helix/users?login=${channel_names.join(
			'&login=',
		)}`;
		const response = await this.http_client.get(url);

		return response.data.data;
	}

	public async get_followers_by_channel_id(
		channel_id: string,
		cursor?: string,
	): Promise<{
		data: FollowRelation[];
		total: number;
		pagination: { cursor: string };
	}> {
		const url = `https://api.twitch.tv/helix/users/follows?to_id=${channel_id}`;
		const response = await this.http_client.get(url, {
			params: {
				limit: '100',
				after: cursor,
			},
		});

		return response.data;
	}
}
