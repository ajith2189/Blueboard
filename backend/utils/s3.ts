export const publicImageUrlGenerator = (key) => {
  const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  return publicUrl;
};
