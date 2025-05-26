import React, { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { FaDownload, FaSearchMinus, FaSearchPlus, FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfViewerModal({ isOpen, onClose, documentPath }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [error, setError] = useState(null);
    const [scale, setScale] = useState(1.0);
    const [scrollX, setScrollX] = useState(0);
    const [scrollY, setScrollY] = useState(0);
    const containerRef = useRef(null);

    if (!isOpen) return null;

    const pdfUrl = `/storage/${documentPath}`;

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        changePage(1);
    }

    function zoomIn() {
        setScale(prevScale => Math.min(prevScale + 0.2, 3.0));
    }

    function zoomOut() {
        setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
    }

    function handleDownload() {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = documentPath.split('/').pop(); // Get filename from path
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function scrollVertical(direction) {
        if (containerRef.current) {
            const scrollAmount = 100; // pixels to scroll
            const newScrollY = direction === 'up' 
                ? Math.max(0, scrollY - scrollAmount)
                : scrollY + scrollAmount;
            setScrollY(newScrollY);
            containerRef.current.scrollTop = newScrollY;
        }
    }

    function scrollHorizontal(direction) {
        if (containerRef.current) {
            const scrollAmount = 100; // pixels to scroll
            const newScrollX = direction === 'left'
                ? Math.max(0, scrollX - scrollAmount)
                : scrollX + scrollAmount;
            setScrollX(newScrollX);
            containerRef.current.scrollLeft = newScrollX;
        }
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Document Viewer
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={zoomOut}
                                            className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                                            title="Zoom Out"
                                        >
                                            <FaSearchMinus className="w-5 h-5" />
                                        </button>
                                        <span className="text-sm text-gray-600">
                                            {Math.round(scale * 100)}%
                                        </span>
                                        <button
                                            onClick={zoomIn}
                                            className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                                            title="Zoom In"
                                        >
                                            <FaSearchPlus className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={handleDownload}
                                            className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                                            title="Download PDF"
                                        >
                                            <FaDownload className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={onClose}
                                            className="p-2 text-gray-400 hover:text-gray-500"
                                        >
                                            <span className="sr-only">Close</span>
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    {error ? (
                                        <div className="text-red-500">{error}</div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <div className="relative w-full">
                                                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
                                                    <button
                                                        onClick={() => scrollHorizontal('left')}
                                                        className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none bg-white rounded-full shadow-md"
                                                        title="Scroll Left"
                                                    >
                                                        <FaArrowLeft className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
                                                    <button
                                                        onClick={() => scrollHorizontal('right')}
                                                        className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none bg-white rounded-full shadow-md"
                                                        title="Scroll Right"
                                                    >
                                                        <FaArrowRight className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
                                                    <button
                                                        onClick={() => scrollVertical('up')}
                                                        className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none bg-white rounded-full shadow-md"
                                                        title="Scroll Up"
                                                    >
                                                        <FaArrowUp className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10">
                                                    <button
                                                        onClick={() => scrollVertical('down')}
                                                        className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none bg-white rounded-full shadow-md"
                                                        title="Scroll Down"
                                                    >
                                                        <FaArrowDown className="w-5 h-5" />
                                                    </button>
                                                </div>
                                                <div 
                                                    ref={containerRef}
                                                    className="overflow-auto max-h-[70vh] flex justify-center"
                                                >
                                                    <Document
                                                        file={pdfUrl}
                                                        onLoadSuccess={onDocumentLoadSuccess}
                                                        onLoadError={(error) => setError(error.message)}
                                                        className="max-w-full"
                                                    >
                                                        <Page 
                                                            pageNumber={pageNumber} 
                                                            renderTextLayer={true}
                                                            renderAnnotationLayer={true}
                                                            className="max-w-full"
                                                            scale={scale}
                                                        />
                                                    </Document>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center mt-4 space-x-4">
                                                <button
                                                    type="button"
                                                    onClick={previousPage}
                                                    disabled={pageNumber <= 1}
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                                >
                                                    Previous
                                                </button>
                                                <span className="text-sm text-gray-700">
                                                    Page {pageNumber} of {numPages || '--'}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={nextPage}
                                                    disabled={pageNumber >= numPages}
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 