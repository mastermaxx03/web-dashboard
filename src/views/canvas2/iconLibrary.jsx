import React from 'react';
import { GiPowerGenerator } from 'react-icons/gi';
import {
  BsLightningChargeFill, // Transformer
  BsServer, // RMU
  BsPlugFill, // Feeder
  BsGearFill, // Generic/Custom
  BsQuestionSquare, // Default
  BsKanban, // Panel
  BsToggleOn, // Switch
  BsBatteryCharging, // UPS
  BsCloud
} from 'react-icons/bs';
import { FaCompressArrowsAlt } from 'react-icons/fa'; // Compressor

// 1. Define the icons we will use
export const iconData = {
  Transformer: <BsLightningChargeFill />,
  RMU: <BsServer />,
  Feeder: <BsPlugFill />,
  Compressor: <FaCompressArrowsAlt />,

  Panel: <BsKanban />,
  Switch: <BsToggleOn />,
  UPS: <BsBatteryCharging />,
  Cloud: <BsCloud />,
  Custom: <BsGearFill />,
  Default: <BsQuestionSquare />
};

// 2. Create a list of the icon names for the picker UI
export const iconList = Object.keys(iconData);

// 3. A helper component to render the icon based on its name (string)
export const DeviceIcon = ({ iconName, ...props }) => {
  const IconComponent = iconData[iconName] || iconData.Default;
  return React.cloneElement(IconComponent, props);
};
