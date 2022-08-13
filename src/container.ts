import { Container } from 'inversify';
import { Logger } from 'tslog';
import { Application } from './Application';
import { TwitchContainerModule } from './ioc/TwitchContainerModule';

export const get_container = async (): Promise<Container> => {
	const container = new Container();

	const logger = new Logger();

	container.bind(Logger).toConstantValue(logger);
	container.bind(Application).toSelf();

	container.load(new TwitchContainerModule());

	return container;
};
