# Searchable Phone Call Dashboard with Twilio and Deepgram

Store Twilio phone call transcripts and search with a web dashboard.

## Setup

```
git clone https://github.com/deepgram-devs/twilio-voice-searchable-log
cd twilio-voice-searchable-log
npm install
```

Rename `.env.example` to `.env` and populate the values:

```
DG_KEY=replace_with_deepgram_key
TWILIO_ACCOUNT_SID=replace_with_sid
TWILIO_AUTH_TOKEN=replace_with_auth_token
TWILIO_NUMBER=replace_with_twilio_phone_number
FORWARDING_NUMBER=replace_with_your_phone_number
```

## Usage

```
node index.js
```
