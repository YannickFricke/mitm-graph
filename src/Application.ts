import { inject, injectable } from 'inversify';
import { Logger } from 'tslog';
import { TwitchToken } from './twitch/token';

@injectable()
export class Application {
	constructor(
		@inject(Logger)
		private readonly logger: Logger,

		@inject(TwitchToken)
		private readonly twitchToken: TwitchToken,
	) {}

	public async run() {
		this.logger.info('Starting application.');

		this.twitchToken.load_token();

		if (this.twitchToken.needs_refresh()) {
			await this.twitchToken.refresh_token();
		}

		this.twitchToken.save_token();
	}
}
