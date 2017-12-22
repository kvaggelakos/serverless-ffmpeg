

export function getDestinationBucket() {
  return process.env.DESTINATION_BUCKET
}

export function getFfmpegParameters() {
  return process.env.FFMPEG_PARAMS.split(' ')
}