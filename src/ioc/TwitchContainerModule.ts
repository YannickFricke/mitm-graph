import { ContainerModule } from 'inversify';
import { Paginator } from '../twitch/Paginator';
import { TwitchToken } from '../twitch/token';
import { Identifiers } from './Identifiers';
import { ChannelService } from '../twitch/ChannelService';

export class TwitchContainerModule extends ContainerModule {
	constructor() {
		super((bind) => {
			bind(Identifiers.TwitchClientId).toConstantValue(
				process.env.TWITCH_CLIENT_ID,
			);
			bind(Identifiers.TwitchClientSecret).toConstantValue(
				process.env.TWITCH_CLIENT_SECRET,
			);

			bind(TwitchToken).toSelf().inSingletonScope();
			bind(Paginator).toSelf().inSingletonScope();
			bind(ChannelService).toSelf();
		});
	}
}
