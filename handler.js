import ffmpeg from './src/ffmpeg'

export const main = (event, context, callback) => {
  ffmpeg(event, context, callback)
}
