
/**
 * Utilities for calendar integration and event management
 */
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  url?: string;
  attendees?: string[];
}

/**
 * Creates a downloadable iCalendar file (.ics) for a single event
 */
export const createICalendarEvent = (event: CalendarEvent): string => {
  // Format date to iCalendar format: YYYYMMDDTHHMMSSZ
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z';
  };
  
  const startDate = formatDate(event.startTime);
  const endDate = formatDate(event.endTime);
  
  // Generate a unique identifier for the event
  const uid = `${event.id}@intantiko.com`;
  
  // Create the iCalendar content
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Intantiko//Strategic Planning//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `SUMMARY:${event.title}`,
  ];
  
  // Add optional fields if they exist
  if (event.description) icsContent.push(`DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`);
  if (event.location) icsContent.push(`LOCATION:${event.location}`);
  if (event.url) icsContent.push(`URL:${event.url}`);
  
  // Add attendees if any
  if (event.attendees && event.attendees.length > 0) {
    event.attendees.forEach(attendee => {
      icsContent.push(`ATTENDEE;RSVP=TRUE;ROLE=REQ-PARTICIPANT:mailto:${attendee}`);
    });
  }
  
  // Close the event and calendar
  icsContent = icsContent.concat([
    'END:VEVENT',
    'END:VCALENDAR'
  ]);
  
  return icsContent.join('\r\n');
};

/**
 * Downloads an iCalendar file
 */
export const downloadICalendarEvent = (event: CalendarEvent): void => {
  const icsContent = createICalendarEvent(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  
  // Create a link element and trigger the download
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${event.title.replace(/\s+/g, '_')}.ics`;
  link.click();
  
  // Clean up
  URL.revokeObjectURL(link.href);
};

/**
 * Adds an event to Google Calendar via URL
 */
export const addToGoogleCalendar = (event: CalendarEvent): void => {
  // Format dates for Google Calendar URL
  const formatGoogleDate = (date: Date): string => {
    return date.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z';
  };
  
  const startDate = formatGoogleDate(event.startTime);
  const endDate = formatGoogleDate(event.endTime);
  
  // Build the Google Calendar URL
  let url = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  url += `&text=${encodeURIComponent(event.title)}`;
  url += `&dates=${startDate}/${endDate}`;
  
  if (event.description) url += `&details=${encodeURIComponent(event.description)}`;
  if (event.location) url += `&location=${encodeURIComponent(event.location)}`;
  
  // Open the URL in a new tab
  window.open(url, '_blank');
};

/**
 * Adds an event to Microsoft Outlook via URL
 */
export const addToOutlookCalendar = (event: CalendarEvent): void => {
  // Format dates for Outlook URL (different format)
  const formatOutlookDate = (date: Date): string => {
    return date.toISOString();
  };
  
  const startDate = formatOutlookDate(event.startTime);
  const endDate = formatOutlookDate(event.endTime);
  
  // Build the Outlook URL
  let url = 'https://outlook.office.com/calendar/0/deeplink/compose?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent';
  url += `&subject=${encodeURIComponent(event.title)}`;
  url += `&startdt=${encodeURIComponent(startDate)}`;
  url += `&enddt=${encodeURIComponent(endDate)}`;
  
  if (event.description) url += `&body=${encodeURIComponent(event.description)}`;
  if (event.location) url += `&location=${encodeURIComponent(event.location)}`;
  
  // Open the URL in a new tab
  window.open(url, '_blank');
};

/**
 * Creates a calendar event and provides options to add to different calendars
 */
export const createCalendarEvent = (event: CalendarEvent): {
  downloadIcs: () => void;
  addToGoogle: () => void;
  addToOutlook: () => void;
} => {
  return {
    downloadIcs: () => downloadICalendarEvent(event),
    addToGoogle: () => addToGoogleCalendar(event),
    addToOutlook: () => addToOutlookCalendar(event),
  };
};
