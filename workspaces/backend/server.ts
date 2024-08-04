import express from 'express'
import cors from 'cors'
import multer from 'multer'
import csvToJson from 'convert-csv-to-json'

const app = express()
const port = process.env.PORT ?? 3003

const storage = multer.memoryStorage()
const upload = multer({ storage })

let userData: Array<Record<string, string>> = []

app.use(cors()) //enable cors

app.post('/api/files', upload.single('file'), async (req, res) => {
  const { file } = req
  if (!file) return res.status(500).json({ message: 'File required' })
  if (!file.mimetype.includes('csv'))
    return res.status(500).json({ message: 'File needs to be csv' })

  try {
    const csv = Buffer.from(file.buffer).toString('utf-8')
    console.log({ csv })

    const json = csvToJson.fieldDelimiter(',').csvStringToJson(csv)
    userData = json

    return res
      .status(200)
      .json({ data: userData, message: 'File succesfully uploaded' })
  } catch (error) {
    return res.status(500).json({ message: 'File unsuccesfully uploaded' })
  }
})

app.get('/api/users', async (req, res) => {
  try {
    const { q } = req.query
    if (!q) return res.status(400).json({ message: 'Needs a parameter' })
    if (Array.isArray(q))
      return res.status(400).json({ message: 'Parameter needs to be unique' })

    const search = q.toString().toLowerCase()

    const data = userData.filter((row) =>
      Object.values(row).some((e) => e.toLowerCase().includes(search)),
    )

    return res.status(200).json({ data })
  } catch (error) {
    return res.status(400).json({ message: 'File unsuccesfully uploaded' })
  }
})

app.listen(port, () => {
  console.log('listening to port ', port)
})
