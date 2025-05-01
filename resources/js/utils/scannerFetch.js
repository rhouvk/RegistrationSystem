export async function scannerFetch(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest', // ✅ Laravel ajax() detection
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Something went wrong.');
    }

    return await response.json();
  } catch (err) {
    console.error('📛 scannerFetch error:', err);
    throw err;
  }
}
