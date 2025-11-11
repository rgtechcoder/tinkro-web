// // src/chatbot/SupportPopup.jsx
// import React, { useState } from "react";
// import API_URL from "../config/api";

// export default function SupportPopup({ initialQuestion = "", onClose = () => {}, onSuccess = () => {}, lang = "en" }) {
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [question, setQuestion] = useState(initialQuestion || "");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const submit = async () => {
//     setError("");
//     if (!name.trim() || !phone.trim() || !question.trim()) {
//       setError(lang === "hi" ? "Naam, phone aur question zaroori hain." : "Name, phone and question are required.");
//       return;
//     }
//     setLoading(true);
//     try {
//       const resp = await fetch(`${API_URL}/api/support-request`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, phone, email, question })
//       });
//       const json = await resp.json();
//       setLoading(false);
//       if (!json.ok) {
//         setError(json.error || "Could not submit");
//         return;
//       }

//       // open whatsapp and mailto (let user choose)
//       // we return both urls — frontend can open one or both
//       if (json.wa_url) {
//         // open WhatsApp in new window/tab — but per your requirement you wanted same tab? For mobile, this will open whatsapp app.
//         window.open(json.wa_url, "_blank");
//       }
//       if (json.mailto_url) {
//         // open email client
//         window.location.href = json.mailto_url;
//       }

//       onSuccess(json.entry);
//       onClose();
//     } catch (err) {
//       setLoading(false);
//       setError("Submission failed. Try again.");
//     }
//   };

//   return (
//     <div style={{
//       position: "absolute",
//       inset: 0,
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       background: "rgba(10,20,30,0.45)",
//       zIndex: 999999
//     }}>
//       <div style={{
//         width: "92%",
//         maxWidth: 420,
//         background: "#fff",
//         borderRadius: 12,
//         padding: 18,
//         boxShadow: "0 20px 50px rgba(11,37,64,0.25)"
//       }}>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
//           <div style={{ fontWeight: 700, fontSize: 16 }}>{lang === "hi" ? "Contact Support" : "Contact Support"}</div>
//           <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer" }}>✕</button>
//         </div>

//         <div style={{ marginBottom: 8, color: "#333", fontSize: 13 }}>{lang === "hi" ? "Kripya apne details de: name, phone, email (optional) aur apna question." : "Please provide your details: name, phone, email (optional) and your question."}</div>

//         <div style={{ display: "grid", gap: 8 }}>
//           <input value={name} onChange={e => setName(e.target.value)} placeholder={lang === "hi" ? "Naam" : "Name"} style={{ padding: 10, borderRadius: 8, border: "1px solid rgba(11,37,64,0.08)" }} />
//           <input value={phone} onChange={e => setPhone(e.target.value)} placeholder={lang === "hi" ? "Phone (required)" : "Phone (required)"} style={{ padding: 10, borderRadius: 8, border: "1px solid rgba(11,37,64,0.08)" }} />
//           <input value={email} onChange={e => setEmail(e.target.value)} placeholder={lang === "hi" ? "Email (optional)" : "Email (optional)"} style={{ padding: 10, borderRadius: 8, border: "1px solid rgba(11,37,64,0.08)" }} />
//           <textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder={lang === "hi" ? "Aapka sawaal" : "Your question"} rows={4} style={{ padding: 10, borderRadius: 8, border: "1px solid rgba(11,37,64,0.08)" }} />

//           {error && <div style={{ color: "crimson", fontSize: 13 }}>{error}</div>}

//           <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
//             <button onClick={onClose} style={{ background: "transparent", border: "1px solid rgba(11,37,64,0.08)", padding: "8px 12px", borderRadius: 8 }}>Cancel</button>
//             <button onClick={submit} disabled={loading} style={{ background: "#1976d2", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 8 }}>
//               {loading ? (lang === "hi" ? "Submitting..." : "Submitting...") : (lang === "hi" ? "Submit" : "Submit")}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// ✅ SupportPopup.jsx — Final Version

import React, { useState } from "react";
import "./SupportPopup.css";
import API_URL from "../config/api";
import { X } from "lucide-react";

const SupportPopup = ({ onClose }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    question: "",
  });

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [redirect, setRedirect] = useState({ wa: "", mail: "" });

  const change = (k, v) => setForm({ ...form, [k]: v });

  const submit = async () => {
    if (!form.name || !form.phone || !form.question) {
      alert("Please fill name, phone & question.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/support-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      setLoading(false);
      setDone(true);
      setRedirect({ wa: json.wa_url, mail: json.mailto_url });
    } catch (err) {
      setLoading(false);
      alert("Error sending support request.");
      console.error(err);
    }
  };

  return (
    <div className="support-overlay">
      <div className="support-box">
        <button className="close-x" onClick={onClose}>
          <X size={18} />
        </button>

        {!done ? (
          <>
            <h2>Contact Support</h2>

            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => change("name", e.target.value)}
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => change("phone", e.target.value)}
            />

            <input
              type="email"
              placeholder="Email (optional)"
              value={form.email}
              onChange={(e) => change("email", e.target.value)}
            />

            <textarea
              placeholder="Describe your issue..."
              value={form.question}
              onChange={(e) => change("question", e.target.value)}
            ></textarea>

            <button className="submit-btn" onClick={submit} disabled={loading}>
              {loading ? "Sending..." : "Submit"}
            </button>
          </>
        ) : (
          <>
            <h2>✅ Request Sent!</h2>

            <p>Our team will contact you shortly.</p>

            <a
              href={redirect.wa}
              target="_blank"
              className="wa-btn"
              rel="noreferrer"
            >
              Message on WhatsApp
            </a>

            <a href={redirect.mail} className="email-btn">
              Send Email
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default SupportPopup;
