
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import EmailService from '../services/EmailService';

const LAB_CONTENT = {
  'atal-tinkering-lab': {
    label: 'Atal Tinkering Lab',
    image: '/atl-lab-demoo.jpg', // dummy image path
    features: [
      'Laboratory Set',
      'Curriculum Design',
      'Faculty Training',
      'Compliance Support',
    ],
    vision: `Atal Tinkering Labs (ATLs) are a key initiative of the Atal Innovation Mission (AIM), which operates under the National Institution for Transforming India (NITI) Aayog. AIM is the Indian government\'s flagship program to foster a culture of innovation and entrepreneurship across the country.\n\nThe overarching vision is to nurture one million children in India as \"Neoteric Innovators\". ATLs aim to foster curiosity, creativity, and imagination in young minds so that they can create solutions for real-world problems.\n\nThe goal is to inculcate essential 21st-century skills such as design thinking, computational thinking, adaptive learning, physical computing, problem-solving, and critical thinking by providing a platform for students to work with tools and equipment related to Science, Technology, Engineering, and Math (STEM).`,
    grant: `The government offers financial assistance to schools for setting up and running Atal Labs through a structured Grant-in-Aid program. Each selected school receives a total grant of ₹20 lakh. Out of this, ₹10 lakh is provided as a one-time establishment cost in the first year. This amount is meant for purchasing essential equipment such as do-it-yourself (DIY) kits, 3D printers, electronic tools, and other necessary instruments required to set up the lab.\n\nThe remaining ₹10 lakh is allocated for operational and maintenance expenses, which are distributed at ₹2 lakh per year for a maximum of five years. These funds are intended to cover costs such as equipment upkeep, buying consumables, organizing science-related events like lectures and innovation competitions, and paying honorariums to faculty members and mentors. At the beginning of the program, an initial amount of ₹12 lakh (₹10 lakh for setting up the lab and ₹2 lakh for the first year’s operational costs) is directly transferred to the selected schools.`,
    packages: [
      {
        name: 'Atal Tinkering Lab Package 1 (P1)',
        image: '/atl-kit1.jpg',
        price: 150000,
        oldPrice: 200000,
        savings: 50000,
      },
      {
        name: 'Atal Tinkering Lab Package 2 (P2)',
        image: '/images/atl-kit2.jpg',
        price: 85000,
        oldPrice: 99999,
        savings: 14999,
      },
      {
        name: 'Atal Tinkering Lab Package 3 (P3)',
        image: '/images/atl-kit3.jpg',
        price: 69999,
        oldPrice: 99999,
        savings: 30000,
      },
      {
        name: 'Atal Tinkering Lab Package 5 (P5)',
        image: '/images/atl-kit5.jpg',
        price: 15555,
        oldPrice: 21999,
        savings: 6444,
      },
    ],
  },
  // Add more labs here as needed
  'pm-shri-robotics-lab': {
    label: 'PM Shri Robotics Lab',
    image: '/images/pmshri-lab-demo.jpg',
    features: [
      'Robotics Kits',
      'Coding Curriculum',
      'Teacher Workshops',
      'Project Support',
    ],
    vision: 'PM Shri Robotics Lab vision coming soon...',
    grant: 'PM Shri Robotics Lab grant info coming soon...',
    packages: [
      {
        name: 'PM Shri Robotics Starter Kit',
        image: '/images/pmshri-kit1.jpg',
        price: 120000,
        oldPrice: 150000,
        savings: 30000,
      },
      // ...more dummy packages
    ],
  },
  'stem-robotics-lab': {
    label: 'STEM and Robotics Lab',
    image: '/images/stem-lab-demo.jpg',
    features: [
      'STEM Kits',
      'Robotics Modules',
      'Teacher Training',
      'Support Materials',
    ],
    vision: 'STEM and Robotics Lab vision coming soon...',
    grant: 'STEM and Robotics Lab grant info coming soon...',
    packages: [
      {
        name: 'STEM Robotics Basic Kit',
        image: '/images/stem-kit1.jpg',
        price: 50000,
        oldPrice: 60000,
        savings: 10000,
      },
      // ...more dummy packages
    ],
  },
};

const LabSetupPage = () => {
  const { labType } = useParams();
  const lab = LAB_CONTENT[labType] || LAB_CONTENT['atal-tinkering-lab'];
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    organization: '',
    requirements: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('Sending...');
    try {
      const result = await EmailService.sendOrderConfirmation({
        name: form.name,
        email: form.email,
        phone: form.mobile,
        address: form.organization,
        cartItems: [{ title: lab.label, quantity: 1, price: 0 }],
        requirements: form.requirements,
        orderId: `LabQuote-${labType}-${Date.now()}`,
        paymentId: '',
        totalAmount: 0,
      });
      if (result.success) {
        setStatus('Quote request sent successfully!');
        setForm({ name: '', email: '', mobile: '', organization: '', requirements: '' });
      } else {
        setStatus('Failed to send. Please try again.');
      }
    } catch (err) {
      setStatus('Failed to send. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-blue-200 animate-fadeInSlow">
      {/* Top Split Section */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 pt-10 pb-8 px-2 md:px-6 animate-fadeInUp">
        {/* Left: Image + Features */}
        <div className="md:w-1/2 w-full flex flex-col items-center md:items-start gap-6">
          {/* Image with blue gradient overlay */}
          <div className="max-w-xl mx-auto rounded-xl overflow-hidden shadow-2xl mb-0 relative animate-fadeInUp bg-white">
            <img src={lab.image} alt={lab.label} className="w-full aspect-[16/9] object-contain object-center relative z-20 bg-white" />
            <div className="absolute left-4 top-4 z-30 text-lg font-bold text-blue-800 drop-shadow">{lab.label}</div>
          </div>
          {/* Features card with blue tint */}
          <div className="w-full rounded-xl shadow-xl p-5 animate-fadeInUp bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-blue-100">
            <h2 className="text-xl font-bold text-blue-700 mb-3">{lab.label}</h2>
            <ul className="space-y-3">
              {lab.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-base font-medium text-gray-700">
                  <span className="inline-block w-5 h-5 bg-blue-100 border-2 border-blue-400 rounded mr-2 flex items-center justify-center">
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M4 8l3 3 5-5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Right: Form */}
        <div className="md:w-1/2 w-full flex items-center">
          <div className="w-full bg-gradient-to-br from-white via-blue-50 to-blue-100/80 rounded-2xl shadow-2xl p-8 border border-blue-100 animate-fadeInUp">
            <h1 className="text-2xl font-extrabold text-blue-700 mb-2 text-center tracking-tight drop-shadow-sm">Get Quote for {lab.label}</h1>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full border border-blue-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none transition" />
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700 font-semibold mb-1">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border border-blue-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none transition" />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-gray-700 font-semibold mb-1">Mobile Number</label>
                  <input type="tel" name="mobile" value={form.mobile} onChange={handleChange} required className="w-full border border-blue-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none transition" />
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700 font-semibold mb-1">School/Company</label>
                  <input type="text" name="organization" value={form.organization} onChange={handleChange} required className="w-full border border-blue-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none transition" />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Requirements</label>
                <textarea name="requirements" value={form.requirements} onChange={handleChange} required className="w-full border border-blue-200 px-3 py-2 rounded-lg min-h-[70px] focus:ring-2 focus:ring-blue-300 outline-none transition" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2.5 rounded-lg font-bold text-lg shadow hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-60" disabled={status === 'Sending...'}>
                {status === 'Sending...' ? 'Sending...' : 'Submit'}
              </button>
              {status && <div className={`text-center text-base mt-2 ${status.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{status}</div>}
            </form>
          </div>
        </div>
      </div>
      {/* Details Section */}
      <div className="max-w-4xl mx-auto mt-10 px-2 md:px-0 animate-fadeInUp">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">{lab.label} Vision</h2>
        <p className="text-lg text-gray-700 text-center whitespace-pre-line mb-10">{lab.vision}</p>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Government Grant for Setting Up {lab.label}</h2>
        <p className="text-lg text-gray-700 text-center whitespace-pre-line mb-10">{lab.grant}</p>
      </div>
      {/* Packages Section */}
      <div className="max-w-6xl mx-auto mt-10 px-2 md:px-0 animate-fadeInUp">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{lab.label} Kits & Packages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {lab.packages.map((pkg, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center border border-blue-100 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fadeInUp"
            >
              <div className="w-full h-40 flex items-center justify-center mb-3 overflow-hidden rounded bg-gray-50 border">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="object-contain h-full w-full"
                  onError={e => { e.target.onerror = null; e.target.src = '/images/placeholder.jpg'; }}
                />
              </div>
              <div className="font-semibold text-center text-lg mb-1">{pkg.name}</div>
              <div className="text-gray-500 line-through text-sm">Rs. {pkg.oldPrice?.toLocaleString()}</div>
              <div className="text-blue-700 font-bold text-xl mb-1">Rs. {pkg.price?.toLocaleString()}</div>
              <div className="text-green-600 text-xs mb-2">Save Rs. {pkg.savings?.toLocaleString()}</div>
              <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">NOTIFY ME</button>
            </div>
          ))}
        </div>
      </div>

      <div className="h-10" />
    </div>
  );
};

export default LabSetupPage;
