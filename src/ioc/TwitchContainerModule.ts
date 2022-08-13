import { ContainerModule } from 'inversify';
import { Paginator } from '../twitch/Paginator';
import { TwitchToken } from '../twitch/token';
import { Identifiers } from './Identifiers';
import axios from 'axios';
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

			bind(Identifiers.HTTPClient)
				.toDynamicValue(async (ctx) => {
					const token_handler = await ctx.container.getAsync(
						TwitchToken,
					);

					if (token_handler.needs_refresh()) {
						await token_handler.refresh_token();
					}

					return axios.create({
						validateStatus: () => true,
						headers: {
							'Client-ID': ctx.container.get(
								Identifiers.TwitchClientId,
							),
							Authorization: `Bearer ${token_handler.token}`,
						},
					});
				})
				.inSingletonScope();

			bind(TwitchToken).toSelf().inSingletonScope();
			bind(Paginator).toSelf().inSingletonScope();
			bind(ChannelService).toSelf();
		});
	}
}
