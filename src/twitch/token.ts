import { existsSync, readFileSync, writeFileSync } from 'fs';
import { inject, injectable } from 'inversify';
import { Logger } from 'tslog';
import { Identifiers } from '../ioc/Identifiers';
import { HTTPClient } from '../types';

@injectable()
export class TwitchToken {
	private token?: string;
	private expires_at: Date = new Date();

	private readonly token_file_path = './.twitch_token';

	/**
	 * Creates an instance of TwitchToken.
	 *
	 * @param {Logger} logger The logger.
	 * @memberof TwitchToken
	 */
	constructor(
		@inject(Logger)
		private logger: Logger,

		@inject(Identifiers.HTTPClient)
		private readonly http_client: HTTPClient,

		@inject(Identifiers.TwitchClientId)
		private readonly client_id: string,

		@inject(Identifiers.TwitchClientSecret)
		private readonly client_secret: string,
	) {}

	/**
	 * Tries to load the token from the token file.
	 *
	 * @memberof TwitchToken
	 */
	public load_token() {
		if (existsSync(this.token_file_path) === false) {
			this.logger.debug('No token file found.');

			return;
		}

		this.logger.info('Loading token from file.');

		const token_file_contents = readFileSync(this.token_file_path, 'utf8');
		const token_file = JSON.parse(token_file_contents);

		this.token = token_file.token;
		this.expires_at = new Date(token_file.expires_at);
	}

	/**
	 * Saves the token to the token file.
	 *
	 * @memberof TwitchToken
	 */
	public save_token() {
		const token_file_contents = {
			token: this.token,
			expires_at: this.expires_at.toISOString(),
		};

		this.logger.info('Saving token to file.');

		writeFileSync(
			this.token_file_path,
			JSON.stringify(token_file_contents),
		);
	}

	/**
	 * Returns true when the token needs to be refreshed.
	 *
	 * @return {boolean} True when the token needs to be refreshed. False otherwise.
	 * @memberof TwitchToken
	 */
	public needs_refresh(): boolean {
		if (this.token === undefined) {
			return true;
		}

		return this.expires_at < new Date();
	}

	public async refresh_token() {
		const response = await this.http_client.postForm(
			'https://id.twitch.tv/oauth2/token',
			{
				client_id: this.client_id,
				client_secret: this.client_secret,
				grant_type: 'client_credentials',
			},
		);

		const token_data = response.data;

		this.token = token_data.access_token;
		this.expires_at = new Date(
			new Date().getTime() + token_data.expires_in * 1000,
		);
	}
}
