

export function getFileInformation({Records: [{s3: {bucket, object}}]}) {
	return {
		bucket: bucket.name,
		key: decodeURIComponent(object.key).replace(/\+/g, " ")
  }
}