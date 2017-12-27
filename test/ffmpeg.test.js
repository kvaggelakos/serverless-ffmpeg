import test from 'ava'
import {resolve, join} from 'path'
import {existsSync, removeSync} from 'fs-extra'

import {ffprobe, ffmpeg} from '../src/ffmpeg'

test('can run ffprobe on file', async t => {
  const result = await ffprobe(resolve('test/fixtures/file1.mp3'))
  t.is(result['streams'][0]['index'], 0)
  t.is(result['streams'][0]['codec_name'], 'mp3')
  t.is(result['streams'][0]['codec_type'], 'audio')
})


test('can run ffmpeg on file', async t => {
  const outputDirectory = await ffmpeg(resolve('test/fixtures/file1.mp3'), 'm3u', [
    '-b:a','64k',
    '-f','hls',
    '-hls_time', '10.0',
    '-hls_list_size', '0'
  ])

  t.true(existsSync(`${outputDirectory}/file1.m3u`))

  // Clean up
  removeSync(outputDirectory)
})