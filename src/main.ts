import 'reflect-metadata';
import { Application } from './Application';
import { get_container } from './container';
import { config } from 'dotenv';

config();

(async () => {
	const container = await get_container();

	const application = container.get(Application);
	await application.run();
})();
