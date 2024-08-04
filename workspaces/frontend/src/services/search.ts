import { ApiSearchResponse, Data } from './types.ts'
import { API_HOST } from '../config.ts'

export const searchFile = async (search: string): Promise<[Error?, Data?]> => {
  try {
    const res = await fetch(`${API_HOST}/users?q=${search}`)

    if (!res.ok) return [new Error(`Error updating file ${res.statusText}`)]

    const json = (await res.json()) as ApiSearchResponse

    return [undefined, json.data]
  } catch (error) {
    if (error instanceof Error) return [error]
  }
  return [new Error('Unknown error')]
}
