import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader, 
  IndianRupee,
  TestTube,
  Settings,
  History
} from 'lucide-react';
import razorpayService from '../services/RazorpayService';

const RazorpayTestPage = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    checkRazorpayStatus();
    loadPaymentHistory();
  }, []);

  const checkRazorpayStatus = async () => {
    const razorpayStatus = razorpayService.getStatus();
    setStatus(razorpayStatus);
  };

  const loadPaymentHistory = () => {
    const history = razorpayService.getPaymentHistory();
    setPaymentHistory(history.slice(0, 5)); // Show last 5 payments
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      const result = await razorpayService.testConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: error.message,
        message: 'Test failed with error'
      });
    } finally {
      setLoading(false);
    }
  };

  const testPayment = async () => {
    setLoading(true);
    try {
      const result = await razorpayService.testPayment();
      setTestResult(result);
      if (result.success) {
        loadPaymentHistory(); // Refresh history
      }
    } catch (error) {
      setTestResult({
        success: false,
        error: error.message,
        message: 'Payment test failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const StatusCard = ({ title, value, status, icon: Icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-lg font-semibold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-full ${
          status === 'success' ? 'bg-green-100 text-green-600' :
          status === 'error' ? 'bg-red-100 text-red-600' :
          'bg-yellow-100 text-yellow-600'
        }`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🚀 Razorpay Integration Testing
          </h1>
          <p className="text-gray-600">
            Test and verify Razorpay payment gateway integration
          </p>
        </motion.div>

        {/* Status Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatusCard
            title="SDK Status"
            value={status?.sdkLoaded ? 'Loaded' : 'Not Loaded'}
            status={status?.sdkLoaded ? 'success' : 'error'}
            icon={status?.sdkLoaded ? CheckCircle : XCircle}
          />
          <StatusCard
            title="Key Configuration"
            value={status?.keyConfigured ? 'Configured' : 'Missing'}
            status={status?.keyConfigured ? 'success' : 'error'}
            icon={status?.keyConfigured ? Settings : AlertTriangle}
          />
          <StatusCard
            title="Environment"
            value={status?.testMode ? 'Test Mode' : 'Live Mode'}
            status={status?.testMode ? 'success' : 'warning'}
            icon={TestTube}
          />
          <StatusCard
            title="Key ID"
            value={status?.keyId || 'Not Set'}
            status={status?.keyConfigured ? 'success' : 'error'}
            icon={CreditCard}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <TestTube className="mr-2" />
              Testing Controls
            </h2>

            <div className="space-y-4">
              {/* Configuration Test */}
              <button
                onClick={testConnection}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <Loader className="animate-spin mr-2" size={20} />
                ) : (
                  <Settings className="mr-2" size={20} />
                )}
                Test Configuration
              </button>

              {/* Test Payment */}
              <button
                onClick={testPayment}
                disabled={loading || !status?.sdkLoaded || !status?.keyConfigured}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <Loader className="animate-spin mr-2" size={20} />
                ) : (
                  <IndianRupee className="mr-2" size={20} />
                )}
                Test ₹1 Payment
              </button>

              {/* Instructions */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Test Instructions:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• First, test the configuration</li>
                  <li>• Then try a ₹1 test payment</li>
                  <li>• Use test card: 4111 1111 1111 1111</li>
                  <li>• Any future date and CVV works</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Test Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <CheckCircle className="mr-2" />
              Test Results
            </h2>

            {testResult ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-lg border ${
                  testResult.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center mb-2">
                  {testResult.success ? (
                    <CheckCircle className="text-green-600 mr-2" size={20} />
                  ) : (
                    <XCircle className="text-red-600 mr-2" size={20} />
                  )}
                  <span className={`font-semibold ${
                    testResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {testResult.success ? 'Success!' : 'Failed'}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{testResult.message}</p>
                
                {testResult.payment && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <p className="text-xs text-gray-600">Payment ID:</p>
                    <p className="text-sm font-mono text-gray-800">{testResult.payment.razorpay_payment_id}</p>
                  </div>
                )}
                
                {testResult.error && (
                  <div className="mt-3 p-3 bg-red-100 rounded border border-red-200">
                    <p className="text-xs text-red-600">Error:</p>
                    <p className="text-sm font-mono text-red-800">{testResult.error}</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TestTube size={48} className="mx-auto mb-2 text-gray-300" />
                <p>Run a test to see results here</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Payment History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <History className="mr-2" />
            Recent Test Payments
          </h2>

          {paymentHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 font-semibold text-gray-800">Payment ID</th>
                    <th className="text-left p-3 font-semibold text-gray-800">Amount</th>
                    <th className="text-left p-3 font-semibold text-gray-800">Date</th>
                    <th className="text-left p-3 font-semibold text-gray-800">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-mono text-xs">{payment.razorpay_payment_id}</td>
                      <td className="p-3">₹{payment.amount}</td>
                      <td className="p-3">{new Date(payment.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CreditCard size={48} className="mx-auto mb-2 text-gray-300" />
              <p>No test payments yet</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RazorpayTestPage;