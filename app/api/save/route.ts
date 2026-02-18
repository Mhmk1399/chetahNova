import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/data';
import Data from '@/models/data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businesses, country, category } = body;

    // Check if it's bulk save or single save
    if (businesses && Array.isArray(businesses)) {
      // Bulk save - save multiple businesses
      if (businesses.length === 0) {
        return NextResponse.json(
          { error: 'No businesses to save' },
          { status: 400 }
        );
      }

      // Validate country and category for bulk save
      if (!country || !category) {
        return NextResponse.json(
          { error: 'Country and category are required' },
          { status: 400 }
        );
      }

      // Validate all entries - only name is required
      for (const business of businesses) {
        const { name } = business;
        if (!name) {
          return NextResponse.json(
            { error: `Business name is required` },
            { status: 400 }
          );
        }
      }

      // Connect to database
      await connect();

      // Save all businesses
      const savedBusinesses = [];
      const errors = [];

      for (const business of businesses) {
        try {
          const data = await Data.create({
            name: business.name,
            phoneNNumber: business.phoneNumber || '',
            instagram: business.instagram || '',
            adress: business.address || '',
            email: business.email || '',
            description: business.description || '',
            country: country,
            category: category,
          });
          savedBusinesses.push(data);
        } catch (error: any) {
          errors.push({ name: business.name, error: error.message });
        }
      }

      return NextResponse.json({
        success: true,
        message: `Saved ${savedBusinesses.length} of ${businesses.length} businesses`,
        saved: savedBusinesses.length,
        total: businesses.length,
        errors: errors.length > 0 ? errors : undefined,
      });
    } else {
      // Single save - original behavior
      const { name, phoneNumber, instagram, address, email, description } = body;

      // Validate required fields - only name is required
      if (!name) {
        return NextResponse.json(
          { error: 'Business name is required' },
          { status: 400 }
        );
      }

      // Connect to database
      await connect();

      // Create new data entry
      const data = await Data.create({
        name,
        phoneNNumber: phoneNumber || '',
        instagram: instagram || '',
        adress: address || '',
        email: email || '',
        description: description || '',
      });

      return NextResponse.json({
        success: true,
        message: 'Data saved successfully',
        data: {
          id: data._id,
          name: data.name,
          phoneNumber: data.phoneNNumber,
          instagram: data.instagram,
          address: data.adress,
          email: data.email,
          description: data.description,
        }
      });
    }

  } catch (error: any) {
    console.error('Save error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'This entry already exists in the database' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to save data: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}
