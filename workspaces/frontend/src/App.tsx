import React, { useState } from 'react'
import { Toaster, toast } from 'sonner'
import './App.css'
import { uploadFile } from './services/upload'
import { type Data } from './services/types'
import Search from './steps/Search'

const APP_STATUS = {
  IDLE: 'idle',
  ERROR: 'error',
  READY_USAGE: 'ready_usage',
  UPLOADING: 'uploading',
  READY_UPLOAD: 'ready_upload',
} as const

const BUTTON_TEXT = {
  [APP_STATUS.READY_UPLOAD]: 'Subir archivo',
  [APP_STATUS.UPLOADING]: 'Subiendo',
}

type AppStatusType = (typeof APP_STATUS)[keyof typeof APP_STATUS]

function App() {
  const [appStatus, setAppStatus] = useState<AppStatusType>(APP_STATUS.IDLE)
  const [data, setData] = useState<Data>([])
  const [file, setFile] = useState<File | null>(null)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? []
    console.log(file)
    setAppStatus(APP_STATUS.UPLOADING)

    if (file) {
      setFile(file)
      setAppStatus(APP_STATUS.READY_UPLOAD)
    }
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (appStatus !== APP_STATUS.READY_UPLOAD || !file) return

    setAppStatus(APP_STATUS.UPLOADING)

    const [err, newData] = await uploadFile(file)
    console.log({ newData })

    if (err || !newData) {
      setAppStatus(APP_STATUS.READY_UPLOAD)
      toast.error(err?.message)
      return
    }

    if (newData) setData(newData)

    setAppStatus(APP_STATUS.READY_USAGE)
    toast.success('Subido correctamente')
  }

  const showButton =
    appStatus === APP_STATUS.READY_UPLOAD || appStatus === APP_STATUS.UPLOADING
  return (
    <>
      <Toaster />
      <h1>Challenge: upload csv and search</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            disabled={appStatus === APP_STATUS.UPLOADING}
            onChange={handleInputChange}
            name='file'
            type='file'
            accept='.csv'
          />
        </label>
        {showButton && (
          <button disabled={appStatus === APP_STATUS.UPLOADING}>
            {BUTTON_TEXT[appStatus]}
          </button>
        )}
      </form>
      {data && <Search initialData={data} />}
    </>
  )
}

export default App
