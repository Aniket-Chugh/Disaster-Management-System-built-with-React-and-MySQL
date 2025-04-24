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
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [nearbyPolice, setNearbyPolice] = useState([]);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [nearbyNGOs, setNearbyNGOs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingNear, setLoadingNear] = useState(false); // Corrected variable name
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
      setLoadingNear(true); // Set loading to true while fetching nearby locations
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
      setLoadingNear(false); // Set loading to false once fetching is done
    }
  };


  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Camera access error:", err));
  };

  const capturePhoto = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 640, 480);
    const imageData = canvasRef.current.toDataURL("image/png");
    console.log("Captured image data:", imageData); // Send this to backend if needed
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();

    setLoading(true); // Set loading to true when submitting report

    try {
      const data = {
        description: description,
        photo: photo, // Include photo in the report if available
        latitude: latitude,
        longitude: longitude,
        id: currentuser,
      };

      await axios.post("http://localhost:3001/submit-report", data);
      alert("Report submitted successfully.");
      setDescription("");
      setPhoto(null);
      setTranscription("");
    } catch (err) {
      alert("Error submitting report. Please try again.");
      console.log(err);
    } finally {
      setLoading(false); // Set loading to false once submission is done
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {signedup ? null : <Navigate to={"/"} />}

      <Navbar />
      <div className="p-6 container mx-auto space-y-10">
        <h1 className="text-4xl text-center font-bold text-orange-500">Report a Disaster</h1>

        {/* Voice-to-Text */}
        <section className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-2xl font-semibold text-orange-400">Voice-to-Text</h2>
          <div className="flex gap-4 mt-4">
            <button
              onClick={startRecording}
              disabled={recording}
              className="bg-orange-500 px-4 py-2 rounded"
            >
              {recording ? "Recording..." : "Start Recording"}
            </button>
            <button
              onClick={stopRecording}
              disabled={!recording}
              className="bg-orange-600 px-4 py-2 rounded"
            >
              Stop
            </button>
          </div>
          <p className="mt-4 italic">{transcription || "Your voice text will appear here..."}</p>
        </section>

        {/* Camera Capture */}
        <section className="bg-gray-800 p-6 rounded-xl">
        <div className="mb-6">
        <video ref={videoRef} width="640" height="480" autoPlay></video>
        <canvas ref={canvasRef} width="640" height="480" style={{ display: "none" }}></canvas>
        <div className="mt-2">
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mr-2"
            onClick={startCamera}
          >
            Start Camera
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={capturePhoto}
          >
            Capture Photo
          </button>
        </div>
      </div>
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

          {[{ label: "🚓 Nearby Police Stations", data: nearbyPolice },
            { label: "🏥 Nearby Hospitals", data: nearbyHospitals },
            { label: "👐 Nearby NGOs / Social Facilities", data: nearbyNGOs }].map(({ label, data }, i) => (
            <div className="mt-4" key={i}>
              <h3 className="text-lg font-bold text-white">{label}</h3>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                {loadingNear ? (
                  <li className="italic text-gray-400">
                    <div role="status">
    <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span class="sr-only">Loading...</span>
</div>
                  </li>
                ) : data.length === 0 ? (
                  <li className="italic text-gray-400">No nearby locations found.</li>
                ) : (
                  data.map((place) => (
                    <li key={place.id}>
                      <strong>{place.name}</strong> (Lat: {place.lat.toFixed(4)}, Lon: {place.lon.toFixed(4)})
                    </li>
                  ))
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
