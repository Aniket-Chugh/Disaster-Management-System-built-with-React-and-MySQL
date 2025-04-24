import React, { useState, useRef, useEffect } from "react";
import Navbar from "../Component/NavBar";
import Footer from "../Component/Footer";
import axios from "axios";
import { useAuth } from "./Signuppage";
import { Navigate } from "react-router-dom";

const MakeReport = () => {
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null); // ✅ ADDED STATE
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [nearbyPolice, setNearbyPolice] = useState([]);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [nearbyNGOs, setNearbyNGOs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingNear, setLoadingNear] = useState(false);

  const recognitionRef = useRef(null);
  const streamRef = useRef(null);
  const { signedup, setsignedup, currentuser } = useAuth();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          fetchNearbyOSM(latitude, longitude, "police", setNearbyPolice);
          fetchNearbyOSM(latitude, longitude, "hospital", setNearbyHospitals);
          fetchNearbyOSM(latitude, longitude, "social_facility", setNearbyNGOs);
        },
        () => alert("Please allow location access."),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const startRecording = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => setRecording(true);
      recognition.onend = () => setRecording(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscription(transcript);
        setDescription(transcript); // Autofill description
      };

      recognition.start();
      recognitionRef.current = recognition;
    } else {
      alert("Speech Recognition is not supported in this browser.");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const fetchNearbyOSM = async (lat, lon, type, setter) => {
    const radius = 5000;
    const query =
      type === "social_facility"
        ? `node(around:${radius},${lat},${lon})[social_facility];`
        : `node(around:${radius},${lat},${lon})[amenity=${type}];`;

    const url = `https://overpass-api.de/api/interpreter?data=[out:json];${query}out;`;
    try {
      setLoadingNear(true);
      const res = await fetch(url);
      const data = await res.json();
      setter(
        data.elements.map((el) => ({
          id: el.id,
          name: el.tags?.name || type.toUpperCase(),
          lat: el.lat,
          lon: el.lon,
        }))
      );
    } catch (err) {
      console.error("Error fetching OSM data:", err);
    } finally {
      setLoadingNear(false);
    }
  };

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      })
      .catch((err) => console.error("Camera access error:", err));
  };

  const capturePhoto = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 640, 480);
    const imageData = canvasRef.current.toDataURL("image/png");
    setCapturedImage(imageData); // ✅ SAVE IMAGE
    setPhoto(imageData); // ✅ FOR SUBMISSION
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        description: description,
        photo: photo,
        latitude: latitude,
        longitude: longitude,
        id: currentuser,
      };

      await axios.post("http://localhost:3001/submit-report", data);
      alert("Report submitted successfully.");
      setDescription("");
      setPhoto(null);
      setCapturedImage(null);
      setTranscription("");
    } catch (err) {
      alert("Error submitting report. Please try again.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {!signedup && <Navigate to={"/"} />}
      <Navbar />
      <div className="p-6 container mx-auto space-y-10">
        <h1 className="text-4xl text-center font-bold text-orange-500">Report a Disaster</h1>

        {/* Voice-to-Text */}
        <section className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold text-orange-400">Voice-to-Text</h2>
          <div className="flex gap-4 mt-4">
            <button onClick={startRecording} disabled={recording} className="bg-orange-500 px-4 py-2 rounded">
              {recording ? "Recording..." : "Start Recording"}
            </button>
            <button onClick={stopRecording} disabled={!recording} className="bg-orange-600 px-4 py-2 rounded">
              Stop
            </button>
          </div>
          <p className="mt-4 italic">{transcription || "Your voice text will appear here..."}</p>
        </section>

        {/* Camera Capture */}
        <section className="bg-gray-800 p-6 rounded-xl">
          <video ref={videoRef} width="640" height="480" autoPlay className="border rounded"></video>
          <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }}></canvas>
          <div className="mt-4 flex gap-4">
            <button onClick={startCamera} className="bg-purple-600 px-4 py-2 rounded">Start Camera</button>
            <button onClick={capturePhoto} className="bg-red-600 px-4 py-2 rounded">Capture Photo</button>
          </div>
          {capturedImage && (
            <div className="mt-4 text-center">
              <h2 className="text-lg mb-2">Preview</h2>
              <img src={capturedImage} alt="Captured" className="rounded shadow-md mx-auto mb-2" />
              <a href={capturedImage} download="captured.png" className="bg-purple-700 px-4 py-2 rounded inline-block">Download</a>
            </div>
          )}
        </section>

        {/* Report Submission */}
        <section className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold text-orange-400">Report Details</h2>
          <form onSubmit={handleSubmitReport} className="mt-4">
            <textarea
              rows="4"
              className="w-full p-4 bg-gray-700 rounded-lg"
              placeholder="Describe the disaster..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <button
              type="submit"
              className="mt-4 bg-orange-500 px-6 py-2 rounded hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </form>
        </section>

        {/* Nearby Help */}
        <section className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold text-orange-400">Nearby Help</h2>
          {[{ label: "🚓 Police", data: nearbyPolice },
            { label: "🏥 Hospitals", data: nearbyHospitals },
            { label: "👐 NGOs", data: nearbyNGOs }].map(({ label, data }, i) => (
            <div className="mt-4" key={i}>
              <h3 className="text-lg font-bold">{label}</h3>
              <ul className="ml-6 mt-2 space-y-1 list-disc">
                {loadingNear ? (
                  <li>Loading...</li>
                ) : data.length ? (
                  data.map((place) => (
                    <li key={place.id}>{place.name}</li>
                  ))
                ) : (
                  <li>No nearby locations found.</li>
                )}
              </ul>
            </div>
          ))}
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default MakeReport;
