import {spawn, execFile} from 'child_process'
import {dirname} from 'path'

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

    const opts = {cwd: dirname(file)}


		const cb = (error, stdout) => {
			if (error) {
				reject(error)
      }

			const result = JSON.parse(stdout)

			const isValidFile = result.streams.some(({codec_type, duration}) =>
				(codec_type === 'video' || codec_type === 'audio')
			)

			if (!isValidFile) {
				reject('FFprobe: no valid video stream found')
      } else {
        console.log('Valid file found. FFProbe finished')
        console.log(result)
				resolve(result)
			}
		}

		execFile('ffprobe', args, opts, cb)
			.on('error', reject)
	})
}
