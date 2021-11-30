require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const nedb = require('nedb-promises')
const Twilio = require('twilio')
const { Deepgram } = require('@deepgram/sdk')

const db = nedb.create('calls.db')
const twilio = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
const deepgram = new Deepgram(process.env.DG_KEY)

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))

app.post('/inbound', async (req, res) => {
  const { Caller, CallSid } = req.body
  await db.insert({ Caller, CallSid, date: new Date() })
  const twiml = new Twilio.twiml.VoiceResponse()
  const dial = twiml.dial({
    record: 'record-from-answer-dual',
    recordingStatusCallback: '/recordings'
  })
  dial.number(process.env.FORWARDING_NUMBER)
  res.type('text/xml')
  res.end(twiml.toString())
})

app.post('/recordings', async (req, res) => {
  console.log('Recording received')
  const { CallSid, RecordingUrl } = req.body
  const transcriptionFeatures = { punctuate: true, utterances: true, model: 'phonecall', multichannel: true }
  const { results } = await deepgram.transcription.preRecorded({ url: RecordingUrl }, transcriptionFeatures)
  const utterances = results.utterances.map(utterance => ({
    channel: utterance.channel,
    transcript: utterance.transcript
  }))
  await db.update({ CallSid }, { $set: { RecordingUrl, utterances } })
  res.send('ok')
})

app.get('/recordings', async (req, res) => {
  const recordings = await db.find({ utterances: { $exists: true } }).sort({ date: -1 })
  res.json(recordings)
})

app.listen(3000, console.log(`Listening at ${new Date().toISOString()}`))
