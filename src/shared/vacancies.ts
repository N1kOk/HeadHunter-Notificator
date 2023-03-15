import axios from 'axios'
import { ApiVacanciesResponse, Vacancy } from './types'
import { insert, select } from './db'

export async function fetchNewVacancies(oldVacancyIds: Set<Vacancy['id']>) {
	const vacancies = await fetchAllVacancies()
	return vacancies.filter(value => !oldVacancyIds.has(value.id))
}

export async function fetchAllVacancies() {
	const url = 'https://api.hh.ru/vacancies?order_by=publication_time&period=1&text=vue&schedule=remote'
	const { data } = await axios.get<ApiVacanciesResponse>(url)
	
	return data.items
}

export async function fetchOldVacancyIds() {
	const data = await select()
	
	return new Set<Vacancy['id']>(data?.map(value => value?.[0].toString()))
}

export async function saveVacancyIds(vacancyIds: Set<Vacancy['id']>) {
	await insert([...vacancyIds])
}

export function formatVacancy(vacancy: Vacancy) {
	const name = `${vacancy.name}`
	const link = vacancy.alternate_url
	
	let salary = ''
	salary += vacancy.salary?.from ? `От ${vacancy.salary.from.toLocaleString('ru')} ` : ''
	salary += vacancy.salary?.to ? `До ${vacancy.salary.to.toLocaleString('ru')}` : ''

	return `${name}\n` +
		   (salary ? `${salary}\n` : '') +
		   `${link}`
}

export function filterVacancy(vacancy: Vacancy) {
	const blacklist = [
		/\bfull[- ]?stack\b/i.test(vacancy.name),
		/\bback[- ]?end\b/i.test(vacancy.name),
		/\bteam[- ]?lead\b/i.test(vacancy.name),
		/([\s-]|^)тим[- ]?лид([\s-]|$)/i.test(vacancy.name),
		/\bpython\b/i.test(vacancy.name),
		/\bphp\b/i.test(vacancy.name),
		/\blaravel\b/i.test(vacancy.name),
		/\bjava\b/i.test(vacancy.name),
		/\bangular\b/i.test(vacancy.name),
		/\bdev[- ]?ops\b/i.test(vacancy.name),
		/bitrix/i.test(vacancy.name),
		/битрикс/i.test(vacancy.name),
		/\b[сc]#/i.test(vacancy.name),
		/\w*sql\b/i.test(vacancy.name),
		/postgres/i.test(vacancy.name),
		/(\W|^)\.net\b/i.test(vacancy.name),
		/\basp\.net\b/i.test(vacancy.name),
		/\bdart\b/i.test(vacancy.name),
		/\bflutter\b/i.test(vacancy.name),
		/\brust\b/i.test(vacancy.name),
		/\bruby\b/i.test(vacancy.name),
		/\bgo\b/i.test(vacancy.name),
	]
	
	if (blacklist.some(value => value))
		return false
	
	// noinspection RedundantIfStatementJS
	if (/\breact\b/i.test(vacancy.name) && !/vue/i.test(vacancy.name))
		return false
	
	return true
}
