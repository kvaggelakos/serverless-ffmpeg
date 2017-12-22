import { getFileInformation, download, uploadFolder, deleteObject } from './src/s3'
import { getDestinationBucket, getFfmpegParameters } from './src/env'
import { ffprobe, ffmpeg } from './src/ffmpeg'
import { createReadStream } from 'fs'

export const main = async (event, context, callback) => {
  const {eventName, bucket, key} = getFileInformation(event)

  console.log(`Received ${eventName} for item in bucket: ${bucket}, key: ${key}`)

  try {
    const destPath = await download(bucket, key)
    await ffprobe(destPath)
    const outputPath = await ffmpeg(destPath, 'm3u', getFfmpegParameters())
    await uploadFolder(getDestinationBucket(), key, outputPath)
  } catch (error) {
    callback(error)
  }

}