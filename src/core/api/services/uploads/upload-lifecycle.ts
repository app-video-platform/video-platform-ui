export const uploadToStorageTarget = async ({
  uploadUrl,
  file,
  mockProtocolPrefix,
  failureMessage = 'File upload to storage target failed',
}: {
  uploadUrl: string;
  file: File;
  mockProtocolPrefix?: string;
  failureMessage?: string;
}) => {
  if (
    process.env.REACT_APP_USE_MOCKS === 'true' &&
    mockProtocolPrefix &&
    uploadUrl.startsWith(mockProtocolPrefix)
  ) {
    // Axios Mock Adapter cannot intercept direct storage PUTs. Mock protocols
    // keep the production-shaped flow without pretending binary storage exists.
    if (typeof Response !== 'undefined') {
      return new Response(null, { status: 200 });
    }

    return {
      ok: true,
      status: 200,
      statusText: 'OK',
    } as Response;
  }

  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error(failureMessage);
  }

  return response;
};
