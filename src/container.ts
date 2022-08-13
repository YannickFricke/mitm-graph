import { Container } from 'inversify';

export const get_container = async (): Promise<Container> => {
	const container = new Container();

	return container;
};
