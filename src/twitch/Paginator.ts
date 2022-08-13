import { existsSync, readFileSync, writeFileSync } from 'fs';
import { injectable } from 'inversify';

export enum PaginationType {
	Follows = 'follows',
}

type PaginatedObject<T> = Record<PaginationType, Record<string, T>>;

@injectable()
export class Paginator {
	private unfinished_entries: PaginatedObject<string> = {
		[PaginationType.Follows]: {},
	};

	private finished_entries: PaginatedObject<Date> = {
		[PaginationType.Follows]: {},
	};

	public save_to_file(file_path: string) {
		const file_contents = {
			unfinished: this.unfinished_entries,
			finished: this.finished_entries,
		};

		writeFileSync(
			file_path,
			JSON.stringify(file_contents, null, 4),
			'utf8',
		);
	}

	public load_from_file(file_path: string) {
		if (existsSync(file_path) === false) {
			this.save_to_file(file_path);
		}

		const file_contents = JSON.parse(readFileSync(file_path, 'utf8'));

		this.unfinished_entries = file_contents.unfinished;

		for (const pagination_type of Object.keys(
			this.finished_entries,
		) as PaginationType[]) {
			for (const key of Object.keys(
				this.finished_entries[pagination_type],
			)) {
				this.finished_entries[pagination_type][key] = new Date(
					this.finished_entries[pagination_type][key],
				);
			}
		}
	}

	public get_cursor(type: PaginationType, key: string): string | undefined {
		return this.unfinished_entries[type][key];
	}

	public set_cursor(type: PaginationType, key: string, cursor: string) {
		this.unfinished_entries[type][key] = cursor;
	}

	public has_cursor(type: PaginationType, key: string): boolean {
		if (this.get_cursor(type, key) !== undefined) {
			return true;
		}

		if (this.finished_entries[type][key] !== undefined) {
			return true;
		}

		return false;
	}

	public remove_cursor(type: PaginationType, key: string) {
		delete this.unfinished_entries[type][key];
	}

	public finished_cursor(type: PaginationType, key: string) {
		this.remove_cursor(type, key);
		this.finished_entries[type][key] = new Date();
	}

	public remove_finished_cursor(type: PaginationType, key: string) {
		delete this.finished_entries[type][key];
	}

	public needs_refresh(type: PaginationType, key: string): boolean {
		if (this.get_cursor(type, key) === undefined) {
			return true;
		}

		if (this.finished_entries[type][key] === undefined) {
			return true;
		}

		return this.finished_entries[type][key] < new Date();
	}
}
