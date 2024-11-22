// deviceHelpers.js
export const getDeviceInfo = () => {
    const generateDeviceId = () => {
      const deviceId = crypto.randomUUID();
      localStorage.setItem('deviceId', deviceId);
      return deviceId;
    };
  
    const deviceId = localStorage.getItem('deviceId') || generateDeviceId();
    
    const userAgent = navigator.userAgent.toLowerCase();
    const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
    
    const getDeviceType = () => {
      if (isTablet) return 'tablet';
      if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile/.test(navigator.userAgent)) {
        return 'mobile';
      }
      return 'desktop';
    };
  
    const getOS = () => {
      const platform = navigator.platform;
      const userAgent = navigator.userAgent;
      
      if (platform.indexOf("Win") !== -1) return "Windows";
      if (platform.indexOf("Mac") !== -1) return "MacOS";
      if (platform.indexOf("Linux") !== -1) return "Linux";
      if (/iPhone|iPad|iPod/.test(userAgent)) return "iOS";
      if (/Android/.test(userAgent)) return "Android";
      
      return "Unknown";
    };
  
    return {
      deviceType: getDeviceType(),
      os: getOS(),
      appVersion: process.env.REACT_APP_VERSION || '1.0.0',
      uniqueIdentifier: deviceId
    };
  };
  
  export const getLocationInfo = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ latitude: null, longitude: null });
        return;
      }
  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        () => {
          resolve({ latitude: null, longitude: null });
        },
        { timeout: 5000, maximumAge: 0 }
      );
    });
  };
  
  export const getIpAddress = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error);
      return null;
    }
  };