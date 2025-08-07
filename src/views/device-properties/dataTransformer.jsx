export const transformDataForBackend = (formData, deviceId) => {
  // This is the final object we will send to the backend.

  const backendPayload = {
    name: deviceId,
    jsonObj: {} // Start with an empty jsonObj
  };

  const vKeys = ['VR', 'VY', 'VB'];

  vKeys.forEach((key) => {
    backendPayload.jsonObj[key] = {
      min: formData.acceptable_range_lower * 1000,
      max: formData.acceptable_range_upper * 1000,
      SI: 'V'
    };
  });

  return backendPayload;
};
