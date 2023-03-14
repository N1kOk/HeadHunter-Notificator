import * as path from 'path'
import { readFile } from './files'

const getPath = (filename: string) => path.resolve(__dirname, '../../env/', filename)

const envs = ['TELEGRAM_BOT_TOKEN', 'YC_OAUTH_TOKEN']

for (const env of envs) {
	try {
		process.env[env] = process.env[env] || readFile(getPath(env))
	} catch (error) {
		console.error(`File ./env/${env} not found`)
	}
}
