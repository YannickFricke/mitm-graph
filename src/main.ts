import 'reflect-metadata';
import { Application } from './Application';
import { get_container } from './container';
import { config } from 'dotenv';

config();

(async () => {
	const container = await get_container();

	const application = await container.getAsync(Application);
	await application.run();
})();
