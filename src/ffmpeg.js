import {spawn, execFile} from 'child_process'
import {dirname, basename, extname} from 'path'
import {mkdirSync, existsSync} from 'fs'
import { join } from 'path'
import {tmpdir} from 'os'

process.env['PATH'] += ':' + process.env['LAMBDA_TASK_ROOT']

export function ffprobe(file) {
  return new Promise((resolve, reject) => {

    const args = [
      '-v', 'quiet',
      '-print_format', 'json',
      '-show_format',
      '-show_streams',
      '-i', file
    ]

    const opts = {}

    const cb = (error, stdout) => {
      if (error) {
        reject(error)
      }

      const result = JSON.parse(stdout)

      if (!result.streams) {
        return reject('This file has no streams')
      }

      const isValidFile = result.streams.some(({codec_type, duration}) =>
        (codec_type === 'video' || codec_type === 'audio')
      )

      if (!isValidFile) {
        return reject('FFprobe: no valid media stream found')
      } else {
        console.log('Valid file found. FFProbe finished')
        return resolve(result)
      }
    }

    execFile('ffprobe', args, opts, cb)
      .on('error', reject)
  })
}

export function ffmpeg(file, extension, ffmpegArgs) {
  return new Promise((resolve, reject) => {

    // Create output dir
    const outputDirectory = join(tmpdir(), `ffmpeg-output-${Math.random().toString(36).substring(7)}`)
    if (!existsSync(outputDirectory)) {
      mkdirSync(outputDirectory)
    }

    const args = [
      '-y',
      '-loglevel',
      'warning',
      '-i',
      file,
      ...(ffmpegArgs || []),
      `${join(outputDirectory, basename(file, extname(file)))}.${extension}`,
    ]

    console.log('Running: ffmpeg', args.join(' '))

    const opts = {}

    const child = spawn('ffmpeg', args, opts)
      .on('message', msg => console.log(msg))
      .on('error', reject)
      .on('close', () => resolve(outputDirectory))

    child.stdout.on('data', data => process.stdout.write(data))
    child.stderr.on('data', data => process.stdout.write(data))

  })
}