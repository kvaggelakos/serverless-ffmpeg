import AWS from 'aws-sdk'
import fs from 'fs'

const s3 = new AWS.S3()
const tmpDirectory = '/tmp/'


export function download(Bucket, Key) {
  console.log(`Downloading file: ${Key} from bucket: ${Bucket}`)

  const file = fs.createWriteStream(`${tmpDirectory}/${Key}`)
  file.on('close', () => Promise.resolve())

  return s3.getObject({Bucket, Key})
    .on('error', (error) => Promise.reject(error))
    .createReadStream()
    .pipe(file)
}

export function upload(Bucket, Key, ContentEncoding, ContentType) {
  return s3.putObject({
    Bucket, Key, Body, ContentEncoding, ContentType
  }).on('httpUploadProgress', ({progress, total}) => {
    console.log(`Uploading ${Key} to ${Bucket}: (${Math.round(100 * loaded / total)}%) ${progress} / ${total}`)
  }).promise()
}