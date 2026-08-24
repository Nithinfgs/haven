/**
 * Helper to generate direct 1-click Google Calendar URLs with embedded Google Meet links
 */
export const createGoogleCalendarUrl = (
  title: string,
  details: string,
  meetLocation: string,
  timeStr: string
): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  // Parse hours and minutes from e.g. "2:00 PM"
  let hours = 14;
  let minutes = 0;
  
  try {
    const parts = timeStr.trim().split(' ');
    const timeParts = parts[0].split(':');
    hours = parseInt(timeParts[0], 10) || 14;
    minutes = parseInt(timeParts[1], 10) || 0;
    const meridiem = parts[1]?.toUpperCase();

    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
  } catch (e) {
    hours = 14;
    minutes = 0;
  }
  
  const startHoursStr = String(hours).padStart(2, '0');
  const startMinsStr = String(minutes).padStart(2, '0');
  const endHoursStr = String((hours + 1) % 24).padStart(2, '0');
  
  const startIso = `${year}${month}${day}T${startHoursStr}${startMinsStr}00`;
  const endIso = `${year}${month}${day}T${endHoursStr}${startMinsStr}00`;

  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const params = new URLSearchParams({
    text: title,
    details: `${details}\n\nGoogle Meet Video Link: ${meetLocation}\nProtected by Haven Health Protocols.`,
    location: meetLocation,
    dates: `${startIso}/${endIso}`
  });

  return `${baseUrl}&${params.toString()}`;
};
