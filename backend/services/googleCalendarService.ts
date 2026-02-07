import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Initialize OAuth2 Client
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set refresh token if available
if (process.env.GOOGLE_REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });
}

// Initialize Google Calendar API
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

const isOverlapping = (startA: Date, endA: Date, startB: Date, endB: Date): boolean =>
  startA < endB && endA > startB;

export interface TimeSlot {
  start: Date;
  end: Date;
}

export interface StrategyCallEvent {
  eventId: string;
  summary: string;
  description?: string;
  start: Date;
  end: Date;
  meetLink?: string;
  attendees: string[];
}

export const googleCalendarService = {
  /**
   * Set OAuth2 credentials (call this when you have access/refresh tokens)
   */
  setCredentials(tokens: { access_token: string; refresh_token?: string; expiry_date?: number }) {
    oauth2Client.setCredentials(tokens);
  },

  /**
   * Get available time slots for strategy calls
   * Checks the configured calendar and returns free slots
   */
  async getAvailableSlots(
    startDate: Date,
    endDate: Date,
    durationMinutes: number = 60
  ): Promise<TimeSlot[]> {
    try {
      // For simplicity, we'll generate standard business hours slots
      // In production, you'd query the actual calendar for free/busy information
      
      const slots: TimeSlot[] = [];
      const currentDate = new Date(startDate);
      
      while (currentDate < endDate) {
        // Skip weekends
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          // Business hours: 9 AM to 5 PM
          const morningSlot = new Date(currentDate);
          morningSlot.setHours(9, 0, 0, 0);
          
          const afternoonSlot = new Date(currentDate);
          afternoonSlot.setHours(14, 0, 0, 0);
          
          // Only add future slots
          if (morningSlot > new Date()) {
            slots.push({
              start: new Date(morningSlot),
              end: new Date(morningSlot.getTime() + durationMinutes * 60000),
            });
          }
          
          if (afternoonSlot > new Date()) {
            slots.push({
              start: new Date(afternoonSlot),
              end: new Date(afternoonSlot.getTime() + durationMinutes * 60000),
            });
          }
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      if (slots.length === 0) {
        return slots;
      }

      const freeBusyResponse = await calendar.freebusy.query({
        requestBody: {
          timeMin: startDate.toISOString(),
          timeMax: endDate.toISOString(),
          items: [{ id: calendarId }],
        },
      });

      const busy = freeBusyResponse.data.calendars?.[calendarId]?.busy || [];

      return slots.filter((slot) =>
        !busy.some((block) => {
          if (!block.start || !block.end) {
            return false;
          }
          return isOverlapping(slot.start, slot.end, new Date(block.start), new Date(block.end));
        })
      );
    } catch (error) {
      console.error('Error getting available slots:', error);
      throw error;
    }
  },

  /**
   * Check if a proposed slot is free in Google Calendar
   */
  async isSlotAvailable(startTime: Date, durationMinutes: number = 60): Promise<boolean> {
    try {
      const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
      const freeBusyResponse = await calendar.freebusy.query({
        requestBody: {
          timeMin: startTime.toISOString(),
          timeMax: endTime.toISOString(),
          items: [{ id: calendarId }],
        },
      });

      const busy = freeBusyResponse.data.calendars?.[calendarId]?.busy || [];
      return busy.length === 0;
    } catch (error) {
      console.error('Error checking slot availability:', error);
      throw new Error('Failed to check calendar availability');
    }
  },

  /**
   * Create a strategy call event in Google Calendar
   */
  async createStrategyCall(
    attendeeEmail: string,
    businessName: string,
    startTime: Date,
    durationMinutes: number = 60
  ): Promise<StrategyCallEvent> {
    try {
      const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

      const event = {
        summary: `Strategy Call - ${businessName}`,
        description: `Strategy call with ${businessName} to discuss project requirements and roadmap.`,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: 'UTC',
        },
        attendees: [
          { email: attendeeEmail },
          { email: process.env.GOOGLE_CALENDAR_ID || 'dev@decensatdesign.com' },
        ],
        conferenceData: {
          createRequest: {
            requestId: `strategy-call-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 30 }, // 30 minutes before
          ],
        },
      };

      const response = await calendar.events.insert({
        calendarId,
        requestBody: event,
        conferenceDataVersion: 1,
        sendUpdates: 'all',
      });

      const createdEvent = response.data;

      return {
        eventId: createdEvent.id || '',
        summary: createdEvent.summary || '',
        description: createdEvent.description || undefined,
        start: new Date(createdEvent.start?.dateTime || startTime),
        end: new Date(createdEvent.end?.dateTime || endTime),
        meetLink: createdEvent.hangoutLink || undefined,
        attendees: createdEvent.attendees?.map((a) => a.email || '') || [],
      };
    } catch (error) {
      console.error('Error creating strategy call:', error);
      throw new Error('Failed to create calendar event');
    }
  },

  /**
   * Cancel/delete a strategy call event
   */
  async cancelStrategyCall(eventId: string): Promise<void> {
    try {
      await calendar.events.delete({
        calendarId,
        eventId,
        sendUpdates: 'all',
      });
    } catch (error) {
      console.error('Error canceling strategy call:', error);
      throw new Error('Failed to cancel calendar event');
    }
  },

  /**
   * Update a strategy call event
   */
  async updateStrategyCall(
    eventId: string,
    updates: {
      summary?: string;
      description?: string;
      startTime?: Date;
      durationMinutes?: number;
    }
  ): Promise<StrategyCallEvent> {
    try {
      const event: any = {};

      if (updates.summary) {
        event.summary = updates.summary;
      }

      if (updates.description) {
        event.description = updates.description;
      }

      if (updates.startTime) {
        const endTime = new Date(
          updates.startTime.getTime() + (updates.durationMinutes || 60) * 60000
        );
        event.start = {
          dateTime: updates.startTime.toISOString(),
          timeZone: 'UTC',
        };
        event.end = {
          dateTime: endTime.toISOString(),
          timeZone: 'UTC',
        };
      }

      const response = await calendar.events.patch({
        calendarId,
        eventId,
        requestBody: event,
        sendUpdates: 'all',
      });

      const updatedEvent = response.data;

      return {
        eventId: updatedEvent.id || '',
        summary: updatedEvent.summary || '',
        description: updatedEvent.description || undefined,
        start: new Date(updatedEvent.start?.dateTime || ''),
        end: new Date(updatedEvent.end?.dateTime || ''),
        meetLink: updatedEvent.hangoutLink || undefined,
        attendees: updatedEvent.attendees?.map((a) => a.email || '') || [],
      };
    } catch (error) {
      console.error('Error updating strategy call:', error);
      throw new Error('Failed to update calendar event');
    }
  },

  /**
   * Get event details
   */
  async getEvent(eventId: string): Promise<StrategyCallEvent | null> {
    try {
      const response = await calendar.events.get({
        calendarId,
        eventId,
      });

      const event = response.data;

      return {
        eventId: event.id || '',
        summary: event.summary || '',
        description: event.description || undefined,
        start: new Date(event.start?.dateTime || ''),
        end: new Date(event.end?.dateTime || ''),
        meetLink: event.hangoutLink || undefined,
        attendees: event.attendees?.map((a) => a.email || '') || [],
      };
    } catch (error) {
      console.error('Error getting event:', error);
      return null;
    }
  },
};
