import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import axios from "axios";
import LeftIcon from "../icons/LeftIcon";
import RightIcon from "../icons/RightIcon";
import DownloadIcon from '../icons/DownloadIcon'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function PdfComp(props) {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedPages, setSelectedPages] = useState([]);
  const [newPdfUrl, setNewPdfUrl] = useState(null);
  const [downloadError, setDownloadError] = useState(null);


  useEffect(() => {
    setPageNumber(1); // Reset the page number whenever the PDF file changes
  }, [props.pdfFile]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const togglePageSelection = (page) => {
    setSelectedPages((prevSelectedPages) => {
      if (prevSelectedPages.includes(page)) {
        return prevSelectedPages.filter((p) => p !== page);
      } else {
        return [...prevSelectedPages, page];
      }
    });
  };

  const downloadNewPdf = () => {
    const blob = new Blob([new Uint8Array(atob(newPdfUrl).split("").map((c) => c.charCodeAt(0)))], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "new_pdf.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Downloaded Successfully')
  };


  const extractAndCreatePDF = async () => {
    if (selectedPages.length === 0) {
      toast.error("No pages selected for the new PDF.");
      return;
    }

    try {


      const response = await axios.post("http://localhost:5000/extract-pages-and-create-pdf", {
        pdfFile: props.pdfFile,
        selectedPages,
      });

      if (response.data.status === "ok") {
        setNewPdfUrl(response.data.newPdfData);
      } else {
        setDownloadError("Error creating the new PDF.");
      }
    } catch (error) {
      setDownloadError("Error downloading the new PDF.");
      console.error("Error creating PDF:", error);
    }
  };

  return (
    <div>
      <ToastContainer/>
      <div className="flex justify-center items-center ">
        <div className="cursor-pointer" onClick={goToPreviousPage} disabled={pageNumber === 1}>
         <LeftIcon/>
        </div>
        <div className="mt-10 border border-2 border-gray-400 p-3 rounded-md" style={{ width: "260px", height: "500px", overflowY: "auto" }}>
          <p className="text-xs font-semibold">
            Page {pageNumber} of {numPages}
          </p>
          <div className="page-navigation ">
            <button className="mr-2" onClick={goToPreviousPage} disabled={pageNumber === 1}>
              Previous
            </button>
            <button onClick={goToNextPage} disabled={pageNumber === numPages}>
              Next
            </button>
          </div>
          <Document file={props.pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
            <div>
              <div key={pageNumber}>
                <label className=" text-gray-800 text-sm font-semibold">
                  <input className="mr-2"
                    type="checkbox"
                    checked={selectedPages.includes(pageNumber)}
                    onChange={() => togglePageSelection(pageNumber)}
                  />
                  Page {pageNumber}
                </label>
                <Page
                  width={260}
                  pageNumber={pageNumber}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            </div>
          </Document>
        </div>
        <div className="cursor-pointer" onClick={goToNextPage} disabled={pageNumber === numPages}>
          <RightIcon />
        </div>
      </div>
      <div className=" flex justify-center mt-4 mb-5">
        <button className="bg-cyan-600 text-white font-semibold px-4 p-1 rounded-md " onClick={extractAndCreatePDF}>
          Extract and Create PDF
        </button>
      </div>

      {downloadError && <p className="text-red-500">{downloadError}</p>}


      {newPdfUrl && (
        <div className="mt-2">
          <p  className="mb-3 text-xs font-bold">Newly Created PDF:</p>
          <button className="mb-5 flex gap-2 px-4 py-1 rounded-md bg-green-700 text-white font-semibold cursor-pointer" onClick={downloadNewPdf}>
            Download
            <DownloadIcon/>
          </button>
        </div>
      )}
    </div>
  );
}

export default PdfComp;
