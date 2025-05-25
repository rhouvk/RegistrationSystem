import React, { useState } from 'react';

export default function PdfViewer({ url, onError }) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState(null);

    // Helper to convert old URL to new download route
    const getDownloadUrl = (url) => {
        if (!url) return '';
        // Replace /admin/validations/view-document/ with /download/document/
        return url.replace('/admin/validations/view-document/', '/download/document/');
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        setError(null);
        
        try {
            // Create a hidden iframe to handle the download
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            
            // Set the iframe source to the download URL
            iframe.src = getDownloadUrl(url);
            
            // Clean up after a delay
            setTimeout(() => {
                document.body.removeChild(iframe);
                setIsDownloading(false);
            }, 1000);

        } catch (error) {
            console.error('Download error:', error);
            const errorMessage = `Failed to download PDF: ${error.message}`;
            setError(errorMessage);
            if (onError) {
                onError(errorMessage);
            }
            setIsDownloading(false);
        }
    };

    return (
        <div className="pdf-viewer p-4">
            <div className="text-center">
                <p className="mb-4 text-gray-600">Click the button below to download the PDF document.</p>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
                        <p className="font-medium">Error</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className={`px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors duration-200 flex items-center justify-center gap-2 ${
                        isDownloading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {isDownloading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Downloading...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Download PDF
                        </>
                    )}
                </button>

                <p className="mt-2 text-sm text-gray-500">
                    If the download doesn't start automatically, <a href={getDownloadUrl(url)} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">click here</a>
                </p>
            </div>
        </div>
    );
} 