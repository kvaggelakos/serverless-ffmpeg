import s3 from './s3'
import { getFileInformation } from './aws'

export default (event, context, callback) => {
  const fileInfo = getFileInformation(event)
  console.log(`Bucket: ${fileInfo.bucket}`)
  console.log(`key: ${fileInfo.key}`)
}