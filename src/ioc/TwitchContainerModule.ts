import { ContainerModule } from 'inversify';
import { Identifiers } from './Identifiers';

export class TwitchContainerModule extends ContainerModule {
	constructor() {
		super((bind) => {
			bind(Identifiers.TwitchClientId).toConstantValue(
				process.env.TWITCH_CLIENT_ID,
			);
			bind(Identifiers.TwitchClientSecret).toConstantValue(
				process.env.TWITCH_CLIENT_SECRET,
			);
		});
	}
}