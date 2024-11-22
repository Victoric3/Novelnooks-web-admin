import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from '../../Context/axiosConfig';
import { getDeviceInfo, getLocationInfo, getIpAddress } from '../../Context/deviceHelpers';
import '../../Css/verificationCodeInput.css';

const VerificationCodeInput = () => {
  const [verificationCode, setVerificationCode] = useState(new Array(6).fill(''));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value;
    setVerificationCode(newVerificationCode);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && index > 0 && verificationCode[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newVerificationCode = [...verificationCode];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newVerificationCode[index] = char;
    });
    setVerificationCode(newVerificationCode);

    const lastFilledIndex = newVerificationCode.findLastIndex(code => code !== '');
    if (lastFilledIndex < 5) {
      inputRefs.current[lastFilledIndex + 1].focus();
    }
  };

  const handleSubmit = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const [locationData, ipAddress] = await Promise.all([
        getLocationInfo(),
        getIpAddress()
      ]);
      
      const deviceInfo = getDeviceInfo();

      const response = await instance.patch(`/user/unUsualSignIn`, {
        token: code,
        location: {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        },
        ipAddress,
        deviceInfo: {
          deviceType: deviceInfo.deviceType,
          os: deviceInfo.os,
          appVersion: deviceInfo.appVersion,
          uniqueIdentifier: deviceInfo.uniqueIdentifier,
        }
      });

      if (response.status === 200) {
        setSuccess('Verification successful');
        navigate('/addStory');
      }
    } catch (err) {
      setError(err.response?.data?.errorMessage || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await instance.post(`/user/resendVerificationToken`, { email: localStorage.getItem('userIdentity') });
      if (response.status === 200) {
        setSuccess('New verification code sent to your email');
        setTimeout(() => setSuccess(''), 5000);
      }
    } catch (err) {
      setError(err.response?.data?.errorMessage || 'Failed to resend code');
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <div className="verification-container">
      <div className="verification-card">
        <h2 className="verification-title">Enter Verification Code</h2>
        
        <div className="verification-inputs">
          {verificationCode.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="verification-input"
            />
          ))}
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="verification-actions">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`verify-button ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>

          <button
            onClick={handleResendCode}
            disabled={isLoading}
            className="resend-button"
          >
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationCodeInput;