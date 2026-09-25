import express from 'express'

const app = express()
const port = Number(process.env.PORT) || 5000

app.listen(port, () => {
  console.log(`NairaFlow backend listening on port ${port}`)
})
