import { API_HOST } from '../config'
import { ApiUploadResponse, Data } from './types'

export const uploadFile = async (file: File): Promise<[Error?, Data?]> => {
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res = await fetch(`${API_HOST}/api/files`, {
      method: 'post',
      body: formData,
    })

    if (!res.ok) return [new Error(`Error updating file ${res.statusText}`)]

    const json = (await res.json()) as ApiUploadResponse

    return [undefined, json.data]
  } catch (error) {
    if (error instanceof Error) return [error]
  }
  return [new Error('Unknown error')]
}
