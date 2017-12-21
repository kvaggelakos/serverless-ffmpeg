import test from 'ava'
import {resolve, join} from 'path'

import {ffprobe} from '../src/ffmpeg'

test('can run ffprobe on file', async t => {
  const result = await ffprobe(resolve('test/fixtures/file1.mp3'))
  t.is(result['streams'][0]['index'], 0)
  t.is(result['streams'][0]['codec_name'], 'mp3')
  t.is(result['streams'][0]['codec_type'], 'audio')
})
