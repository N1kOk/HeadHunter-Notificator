import * as fs from 'fs'

export function readFile(path: string) {
	return fs.readFileSync(path).toString('utf8')
}