import { inject, injectable } from 'inversify';
import { Logger } from 'tslog';

@injectable()
export class Application {
	constructor(
		@inject(Logger)
		private readonly logger: Logger,
	) {}

	public async run() {}
}
