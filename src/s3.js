import AWS from 'aws-sdk'
import { createWriteStream, createReadStream, readdirSync } from 'fs'
import { join, basename } from 'path'
import {tmpdir} from 'os'

const s3 = new AWS.S3()

export function download(Bucket, Key) {
  console.log(`Downloading file: ${Key} from bucket: ${Bucket}`)

  return new Promise((resolve, reject) => {
    const destPath = join(tmpdir(), basename(Key))
    const file = createWriteStream(destPath)
    file.on('close', () => resolve(destPath))
    file.on('error', reject)

    s3.getObject({Bucket, Key})
      .on('error', reject)
      .createReadStream()
      .pipe(file)
  })
}

export function upload(Bucket, Key, Body, ContentEncoding, ContentType) {
  return s3.putObject({
    Bucket, Key, Body, ContentEncoding, ContentType
  }).on('httpUploadProgress', ({loaded, total}) => {
    console.log(`Uploading ${Key} to ${Bucket}: (${Math.round(100 * loaded / total)}%) ${loaded} / ${total}`)
  }).promise()
}

export function uploadFolder(bucket, key, folder, contentEncoding, contentType) {
  return new Promise((resolve, reject) => {
    const files = readdirSync(folder)
    Promise.all(
      files.map((file) => {
        return upload(bucket, `${key}/${file}`, createReadStream(join(folder, file), contentEncoding, contentType))
      })
    ).then(resolve).catch(reject)
  })
}

export function deleteObject(Bucket, Key) {
  return s3.deleteObject({Bucket, Key}).promise()
}

export function getFileInformation({Records: [{eventName, s3: {bucket, object}}]}) {
	return {
    eventName,
		bucket: bucket.name,
		key: decodeURIComponent(object.key).replace(/\+/g, " ")
  }
}