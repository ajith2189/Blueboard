export default async function uploadToS3(file : any, uploadURL: string) {
  const response = await fetch(uploadURL, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!response.ok) {
    throw new Error("Upload failed");
  }
  return response
}
//not using 
export const publicUrlGenerator = (key) => {
          const publicUrl = `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.${
          import.meta.env.VITE_AWS_REGION
        }.amazonaws.com/${key}`;

        return publicUrl;

}
