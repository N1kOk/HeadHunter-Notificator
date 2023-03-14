declare global {
	namespace NodeJS {
		interface ProcessEnv {
			TELEGRAM_BOT_TOKEN: string
			YC_OAUTH_TOKEN: string
			YDB_ACCESS_TOKEN_CREDENTIALS: string
		}
	}
}

export interface ApiVacanciesResponse {
	items: Vacancy[]
}

export interface Vacancy {
	id: string
	name: string;
	salary: Salary | null;
	alternate_url: string
}

interface Salary {
	from: number | null;
	to: number | null;
}
