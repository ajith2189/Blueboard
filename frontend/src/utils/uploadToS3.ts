export default async function uploadToS3(file, uploadURL) {
  const response = await fetch(uploadURL, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!response.ok) {
    throw new Error("Upload failed");
  }
}
