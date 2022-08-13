import { Container } from 'inversify';
import { Logger } from 'tslog';
import { Application } from './Application';

export const get_container = async (): Promise<Container> => {
	const container = new Container();

	const logger = new Logger();

	container.bind(Logger).toConstantValue(logger);
	container.bind(Application).toSelf();

	return container;
};
