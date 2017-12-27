import test from 'ava'

import { getFfmpegParameters, getDestinationBucket } from '../src/env'

test('can build ffmpeg params', t => {
  process.env.FFMPEG_PARAMS = '-a -b -c -d 123'
  t.deepEqual(getFfmpegParameters(), ['-a', '-b', '-c', '-d', '123'])
})

test('can get destination bucket from env', t => {
  process.env.DESTINATION_BUCKET = 'dest-bucket'
  t.is(getDestinationBucket(), 'dest-bucket')
})
