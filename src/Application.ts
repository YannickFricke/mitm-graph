import { inject, injectable } from 'inversify';
import { Logger } from 'tslog';
import { Paginator } from './twitch/Paginator';
import { TwitchToken } from './twitch/token';

@injectable()
export class Application {
	constructor(
		@inject(Logger)
		private readonly logger: Logger,

		@inject(TwitchToken)
		private readonly twitchToken: TwitchToken,

		@inject(Paginator)
		private readonly paginator: Paginator,
	) {}

	public async run() {
		this.logger.info('Starting application.');

		this.twitchToken.load_token();

		if (this.twitchToken.needs_refresh()) {
			await this.twitchToken.refresh_token();
		}

		this.twitchToken.save_token();

		this.paginator.load_from_file('paginator.json');

		// Setup the timers
		setInterval(this.twitchToken.save_token, 1000 * 60 * 60);
		setInterval(() => {
			this.logger.info('Saving paginator.');
			this.paginator.save_to_file('paginator.json');
			this.logger.info('Saved paginator.');
		}, 1000 * 60 * 60);
	}
}
