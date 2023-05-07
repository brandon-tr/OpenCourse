export default function isMobileDevice(userAgent: string | null): boolean {
  if (!userAgent) {
    return false;
  }
  // A basic regular expression to match common mobile device user agents
  const mobileDeviceRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileDeviceRegex.test(userAgent);
}
