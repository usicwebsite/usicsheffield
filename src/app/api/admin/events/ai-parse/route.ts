import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/firebase-admin-utils';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ParsedEvent {
  title: string | null;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  price: string | null;
  description: string | null;
}

// POST /api/admin/events/ai-parse - Parse event details using AI
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminToken(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        error: 'AI service not configured' 
      }, { status: 500 });
    }

    const body = await request.json();
    const { eventText } = body;

    // Validate input
    if (!eventText || typeof eventText !== 'string' || !eventText.trim()) {
      return NextResponse.json({ 
        error: 'Event text is required' 
      }, { status: 400 });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Detect if this is multiple events (look for common separators)
    const separators = ['---', '===', '***', '###', 'EVENT:', 'Event:', '\n\n\n', '\n\n---', '\n\n==='];
    let isMultipleEvents = false;
    let eventSections: string[] = [];

    // Check for explicit separators
    for (const separator of separators) {
      if (eventText.includes(separator)) {
        eventSections = eventText.split(separator).map(section => section.trim()).filter(section => section.length > 0);
        if (eventSections.length > 1) {
          isMultipleEvents = true;
          break;
        }
      }
    }

    // If no explicit separators, check for numbered lists or bullet points
    if (!isMultipleEvents) {
      const lines = eventText.split('\n').filter(line => line.trim().length > 0);
      const numberedLines = lines.filter(line => /^\d+\./.test(line.trim()) || /^•/.test(line.trim()) || /^-/.test(line.trim()));
      if (numberedLines.length >= 2 && numberedLines.length === lines.length) {
        eventSections = lines.map(line => line.replace(/^\d+\.\s*/, '').replace(/^•\s*/, '').replace(/^-\s*/, '').trim());
        isMultipleEvents = true;
      }
    }

    // If still not multiple events, treat as single event
    if (!isMultipleEvents) {
      eventSections = [eventText.trim()];
    }

    // Create the prompt for parsing event details
    const prompt = `
You are an AI assistant that extracts structured event information from unstructured text.

${isMultipleEvents ? `Parse the following ${eventSections.length} events and return a JSON array of objects.` : 'Parse the following event information and return a JSON object.'}

${isMultipleEvents ? 'Each object should have these exact fields:' : 'Return a JSON object with these exact fields:'}
- title: The event title/name
- date: Date in YYYY-MM-DD format
- startTime: Start time in HH:MM format (24-hour)
- endTime: End time in HH:MM format (24-hour) - can be null if not specified
- location: Event location/venue
- price: Price as string (e.g., "Free", "10", "15-20") - use "Free" if not mentioned
- description: A clean, detailed description of the event

Rules:
1. If any required field (title, date, startTime, location, description) cannot be determined, set it to null
2. Convert all times to 24-hour format
3. Convert dates to YYYY-MM-DD format
4. Keep the description informative but concise
${isMultipleEvents ? '5. Return ONLY a valid JSON array of objects, no additional text or formatting' : '5. Return ONLY valid JSON, no additional text or formatting'}

${isMultipleEvents ? 'Events to parse (separated by content):' : 'Event text to parse:'}
${eventSections.map((section, index) => isMultipleEvents ? `\n--- Event ${index + 1} ---\n${section}` : section).join('\n')}
`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Try to parse the AI response as JSON (could be object or array)
      let parsedData;
      try {
        // Clean the response text to extract JSON
        const jsonMatch = text.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
        if (!jsonMatch) {
          throw new Error('No JSON found in AI response');
        }
        parsedData = JSON.parse(jsonMatch[0]);

        // Ensure we have an array of events
        if (!Array.isArray(parsedData)) {
          parsedData = [parsedData];
        }

        // Validate that we have at least one event
        if (parsedData.length === 0) {
          throw new Error('No events found in response');
        }

      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', parseError);
        console.error('AI response:', text);
        return NextResponse.json({
          error: 'Failed to parse event details. Please check the format and try again.'
        }, { status: 422 });
      }

      // Check for missing required fields for each event (but don't fail - let user fill them in)
      const requiredFields = ['title', 'date', 'startTime', 'location', 'description'];

      // Process each event and collect missing fields information
      const eventsWithMissingFields = parsedData.map((event: ParsedEvent, index: number) => {
        const missingFields = requiredFields.filter(field => !event[field as keyof ParsedEvent]);
        return {
          event,
          index: index + 1,
          missingFields: missingFields.length > 0 ? missingFields : undefined
        };
      });

      const totalMissingFields = eventsWithMissingFields.flatMap(e => e.missingFields || []);

      // Return partial data with a flag indicating missing fields for each event
      return NextResponse.json({
        success: true,
        parsedData,
        eventsCount: parsedData.length,
        eventsWithMissingFields: eventsWithMissingFields.filter(e => e.missingFields && e.missingFields.length > 0),
        hasMissingFields: totalMissingFields.length > 0,
        message: totalMissingFields.length > 0
          ? `Successfully extracted ${parsedData.length} event(s), but please review and fill in missing information for each event.`
          : `Successfully extracted ${parsedData.length} event(s)!`
      });

      // Set default price for each event if not provided and validate formats
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      parsedData.forEach((event: ParsedEvent, index: number) => {
        // Set default price if not provided
        if (!event.price) {
          event.price = 'Free';
        }

        // Validate date format and add to missing fields if invalid
        if (event.date && !dateRegex.test(event.date)) {
          const eventMissingFields = eventsWithMissingFields[index].missingFields || [];
          if (!eventMissingFields.includes('date')) {
            eventMissingFields.push('date');
            eventsWithMissingFields[index].missingFields = eventMissingFields;
          }
        }

        // Validate time formats and add to missing fields if invalid
        if (event.startTime && !timeRegex.test(event.startTime)) {
          const eventMissingFields = eventsWithMissingFields[index].missingFields || [];
          if (!eventMissingFields.includes('startTime')) {
            eventMissingFields.push('startTime');
            eventsWithMissingFields[index].missingFields = eventMissingFields;
          }
        }

        if (event.endTime && !timeRegex.test(event.endTime)) {
          const eventMissingFields = eventsWithMissingFields[index].missingFields || [];
          if (!eventMissingFields.includes('endTime')) {
            eventMissingFields.push('endTime');
            eventsWithMissingFields[index].missingFields = eventMissingFields;
          }
        }
      });

      // Recalculate total missing fields after validation
      const updatedTotalMissingFields = eventsWithMissingFields.flatMap(e => e.missingFields || []);

      return NextResponse.json({
        success: true,
        parsedData,
        eventsCount: parsedData.length,
        eventsWithMissingFields: eventsWithMissingFields.filter(e => e.missingFields && e.missingFields.length > 0),
        hasMissingFields: updatedTotalMissingFields.length > 0,
        message: updatedTotalMissingFields.length > 0
          ? `Successfully extracted ${parsedData.length} event(s), but please review and fill in missing information for each event.`
          : `Successfully extracted ${parsedData.length} event(s)!`
      });

    } catch (aiError) {
      console.error('Gemini AI error:', aiError);
      return NextResponse.json({ 
        error: 'AI service temporarily unavailable. Please try again or use manual entry.' 
      }, { status: 503 });
    }

  } catch (error) {
    console.error('Error in AI parse endpoint:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
