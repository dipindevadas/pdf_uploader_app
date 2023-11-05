import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import PdfComp from "../components/PdfComponent";
import { Document, Page, pdfjs } from "react-pdf";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

function Home() {
  const [file, setFile] = useState("");
  const [title, setTitle] = useState("");
  const [showFile, setShowFiles] = useState([]);
  const [pdfData, setPdfData] = useState(null);
  const [validation, setValidation] = useState(false);
  // const [userId, setUserId] = useState(userId)

  const Navigate = useNavigate()

  useEffect(() => {
    getFiles();

    const userId = localStorage.getItem('id')

  }, []);

  useEffect(()=>{
    axios.defaults.withCredentials = true
    axios.get('http://localhost:5000/home').then((res)=>{

      if(res.data !== 'success'){
        Navigate('/login')
      }
    }).catch((err)=>{
      console.log(err)
    })
  })




  //Fetching all the uploaded pdf files
  const getFiles = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id')

    const headers = {
      Authorization: `Bearer ${token}`,
      "X-User-Id": userId,
    };
    const result = await axios
      .get("http://localhost:5000/get-files",{
      headers
      })
      .then((res) => {

        setShowFiles(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showPdf = async (pdf) => {
    setPdfData(`http://localhost:5000/files/${pdf}`);
  };

  //File uploading api
  const uploadFile = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('id')
    console.log('user id', userId)

    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Please select a PDF file.");
      return;
    }

    if (title === "") {
      setValidation(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("userId", userId);


    try {
      const token = localStorage.getItem("token");

      const result = await axios.post(
        "http://localhost:5000/upload-files",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (result.data.status === "ok") {
        // alert("uploaded successfully");
        toast.success("uploaded successfully");

        getFiles();
      } else {

      }
    } catch (err) {
      // toast.error("Error uploading the file");
      console.log(err);
    }
  };
  return (
    <div className="App ">
      <Navbar/>
    <ToastContainer />

    <div className="flex justify-center">
      <form
        onSubmit={uploadFile}
        className="bg-gray-200 py-10 mt-10 sm:w-1/3 rounded-md items-center xs:w-full mx-8 "
      >
        <h1 className="text-center font-semibold">Upload File</h1>
        <div className="flex justify-center mt-5 px-8">
          <input
            type="text"
            required
            onChange={(e) => {
              setTitle(e.target.value);
              setValidation(false);
            }}
            className="p-1 w-full px-2 font-semibold  outline-none"
          ></input>
        </div>
        {validation && (
          <p className="mt-1 px-8 text-red-500 font-bold text-sm">
            File Name is required *
          </p>
        )}

        <div className="flex justify-center mt-5 px-2">
          <input
            type="file"
            onChange={(e) => {
              setFile(e.target.files[0]);
              console.log("uploaded file", e.target.files[0]);
            }}
            required
            // accept="application/pdf"
          ></input>
        </div>

        <div className="mt-2 flex justify-center items-center">
          <button
            className="bg-cyan-600  text-white font-bold px-4 py-1  rounded-md"
            type="submit"
            onClick={uploadFile}
          >
            Upload
          </button>
        </div>
      </form>
    </div>

    <div className="mt-10 flex justify-center text-center">
      {showFile.length === 0 && (
        <h1 className="px-5 text-lg  font-semibold">No files available</h1>
      )}
    </div>

    <div className="mt-6 grid sm:grid-cols-4 grid-cols-2">
      {showFile.length > 0 &&
        showFile.map((file, index) => {
          return (
            <div className="text-center mb-3" key={index}>
              <h1 className="text-xl text-gray-500 font-bold capitalize ">
                {file.title}
              </h1>

              <button
                className="bg-cyan-600  text-white font-semibold px-6 py-1 mt-2 rounded-md"
                onClick={() => showPdf(file.pdf)}
              >
                show PDF
              </button>
            </div>
          );
        })}
    </div>

    <div className="flex justify-center items-center  ">
      {pdfData === null ? "" : <PdfComp className="" pdfFile={pdfData} />}
    </div>
  </div>
  )
}

export default Home