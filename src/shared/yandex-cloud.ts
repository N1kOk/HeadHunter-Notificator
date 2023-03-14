import axios from 'axios'

export async function fetchIAMToken() {
	interface Response {
		iamToken: string
		expiresAt: string
	}
	
	const { data } = await axios.post<Response>('https://iam.api.cloud.yandex.net/iam/v1/tokens', {
		yandexPassportOauthToken: process.env.YC_OAUTH_TOKEN,
	})
	
	return data.iamToken
}