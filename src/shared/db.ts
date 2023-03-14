import { Driver, getCredentialsFromEnv } from 'ydb-sdk'
import { fetchIAMToken } from './yandex-cloud'

let driver: Driver | undefined

async function getOrCreateDriver() {
	if (driver) {
		return driver
	}
	
	process.env.YDB_ACCESS_TOKEN_CREDENTIALS = await fetchIAMToken()
	
	const timeout = 10000
	const endpoint = 'grpcs://ydb.serverless.yandexcloud.net:2135'
	const database = '/ru-central1/b1gvu3shfkegds9td342/etn1se4j3or25b14skho'
	const authService = getCredentialsFromEnv()
	
	driver = new Driver({ endpoint, database, authService })
	
	if (!await driver.ready(timeout)) {
		console.error(`Driver has not become ready in ${timeout}ms!`)
		process.exit(1)
	}
	
	return driver
}

export async function insert(ids: string[]) {
	const driver = await getOrCreateDriver()
	
	return driver.tableClient.withSession(async (session) => {
		const query = `UPSERT INTO vacancies (id) VALUES ${ids.map(id => `(${id})`).join(',')}`
		await session.executeQuery(query)
	})
}

export async function select() {
	const driver = await getOrCreateDriver()
	
	return driver.tableClient.withSession(async (session) => {
		const query = `SELECT id FROM vacancies`
		const { resultSets } = await session.executeQuery(query)
		
		return resultSets[0].rows?.map(row => row.items?.map(obj => Object.values(obj)[2]))
	})
}
