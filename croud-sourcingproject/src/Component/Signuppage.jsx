import { useEffect, useState, createContext, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Navbar from './NavBar';
import Footer from './Footer';
import { IoArrowBackCircleSharp } from "react-icons/io5";
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [signedup, setsignedup] = useState(() => {
        const savedStatus = localStorage.getItem('signedup');
        return savedStatus ? JSON.parse(savedStatus) : false;
    });

    const [username, setUserName] = useState(() => {
        const savedUsername = localStorage.getItem('username');
        return savedUsername || '';
    });



    const [currentuser, setcurrentuser] = useState(() => {
        const savedCurrentUser = localStorage.getItem('currentuser');
        return savedCurrentUser || '';
    });

    useEffect(() => {
        localStorage.setItem('signedup', JSON.stringify(signedup));
        localStorage.setItem('username', username);
        localStorage.setItem('currentuser', currentuser);
        localStorage.setItem('location', JSON.stringify(location));

    }, [signedup, username, currentuser ,location]);

    return (
        <AuthContext.Provider value={{ signedup, setsignedup, username, setUserName, currentuser, setcurrentuser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        otp: '',
        password: '',
    });

    const { signedup, setsignedup, setUserName, setcurrentuser } = useAuth();

    const [errorMessage, setErrorMessage] = useState('');
    const [step, setStep] = useState(1);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhoneSubmit = async (e) => {
        e.preventDefault();
        const phone = formData.phone.trim();
        if (!/^\+91\d{10}$/.test(phone)) {
            setErrorMessage("Enter valid phone number in format +91XXXXXXXXXX");
            return;
        }

        try {
            await axios.post("http://localhost:3001/send-otp", { phone });
            setStep(2);
            setErrorMessage('');
        } catch (err) {
            setErrorMessage("Error sending OTP");
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3001/verify-otp", {
                phone: formData.phone,
                otp: formData.otp,
            });
            if (res.data.success) {
                setStep(3);
                setErrorMessage('');
            } else {
                setErrorMessage("Invalid OTP");
            }
        } catch {
            setErrorMessage("Verification failed");
        }
    };

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        if (formData.email && !formData.email.endsWith('@gmail.com')) {
            setErrorMessage("Email must end with @gmail.com");
            return;
        }

        try {
            const res = await axios.post("http://localhost:3001/users", formData);
            setsignedup(true);
            setUserName(formData.name);
            setcurrentuser(res.data.user.id);
            alert("Signup successful!");
            setFormData({ name: '', email: '', phone: '', otp: '', password: '' });
            setStep(1);
        } catch (err) {
            console.error("Signup error:", err);
            setErrorMessage("Signup failed. Please try again.");
        }
    };

    if (signedup) {
        return <Navigate to="/" />;
    }

    return (
        <div>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-gray-800">
                <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-2xl">
                    <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
                    {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

                    {step === 1 && (
                        <form onSubmit={handlePhoneSubmit}>
                            <label>Phone Number</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-2 border rounded" />
                            <button type="submit" className="w-full mt-4 bg-indigo-600 text-white p-2 rounded">Send OTP</button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleOtpSubmit}>
                            <label>OTP</label>
                            <input type="text" name="otp" value={formData.otp} onChange={handleChange} required className="w-full p-2 border rounded" />
                            <button type="submit" className="w-full mt-4 bg-indigo-600 text-white p-2 rounded">Verify OTP</button>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleSignUpSubmit}>
                            <label>Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded" />

                            <label>Email (optional)</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" />

                            <label>Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full p-2 border rounded" />

                            <button type="submit" className="w-full mt-4 bg-indigo-600 text-white p-2 rounded">Sign Up</button>
                        </form>
                    )}

                    <Link to="/privacy" className="mt-4 text-blue-600 underline flex items-center gap-1">
                        Privacy Policy
                    </Link>
                    <Link to="/" className="mt-4 text-blue-600 underline flex items-center gap-1">
                        <IoArrowBackCircleSharp /> Back to Home
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
}
