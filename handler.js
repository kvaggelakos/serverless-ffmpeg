import { getFileInformation, download, upload, deleteObject } from './src/s3'
import { getDestinationBucket } from './src/env'
import { ffprobe } from './src/ffmpeg'
import { createReadStream } from 'fs'

export const main = async (event, context, callback) => {
  const {eventName, bucket, key} = getFileInformation(event)

  console.log(`Received ${eventName} for item in bucket: ${bucket}, key: ${key}`)

  try {
    const destPath = await download(bucket, key)
    console.log(`destpath is: ${destPath}`)
    await ffprobe(destPath)
  } catch (error) {
    callback(error)
  }

}