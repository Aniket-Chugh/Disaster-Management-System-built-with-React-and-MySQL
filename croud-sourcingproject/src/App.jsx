import { Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import NGOSearch from "./Component/NGOSearch";
import SignUpPage from "./Component/Signuppage";
import MakeReport from "./Component/MakeReport";
import AllUser from "./Component/AllUser";
import { AboutPage } from "./Component/AboutUs";
import { ContactPage } from "./Component/Contact";
import { PrivacyPolicy } from "./Component/PrivacyPolicy";
import { TermsAndConditions } from "./Component/Terms";
import { SupportPage } from "./Component/SupportPage";
import { AuthProvider } from "./Component/Signuppage";
import RecentReports from "./Component/MakeReports";
import NoPage from "./Component/NoPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ngo-search" element={<NGOSearch />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/report" element={<MakeReport />} />
        <Route path="/all" element={<AllUser />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/reports" element={<RecentReports />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
