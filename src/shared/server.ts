import express from 'express'
import { fetchNewVacancies, fetchOldVacancyIds, filterVacancy, formatVacancy, saveVacancyIds } from './vacancies'
import { sendNotification } from './notifications'

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.all('*', async (req, res) => {
	const oldVacancyIds = await fetchOldVacancyIds()
	const newVacancies = await fetchNewVacancies(oldVacancyIds)
	
	const filteredVacancies = newVacancies.filter(filterVacancy)
	const formattedVacancies = filteredVacancies.map(formatVacancy)
	
	if (formattedVacancies.length) {
		console.log('Sending list of vacancies...')
		
		const text = formattedVacancies.join('\n\n')
		await sendNotification(text)
	} else {
		console.log('Vacancies not found')
	}
	
	newVacancies.forEach(value => oldVacancyIds.add(value.id))
	await saveVacancyIds(oldVacancyIds)
	
	res.json({ status: 'ok' })
})

const port = process.env.PORT || 80

app.listen(port, () => {
	console.log(`App listening at port ${port}`)
})
