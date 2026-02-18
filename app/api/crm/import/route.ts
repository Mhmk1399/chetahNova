import { NextRequest, NextResponse } from 'next/server';
import connect from "../../../../lib/data"
import Customer from '@/models/Customer';
import Data from '../../../../models/data';

// POST - Import customers from various sources
export async function POST(request: NextRequest) {
  try {
    await connect();

    const body = await request.json();
    const { source, data: importData, filters } = body;

    let customersToImport: any[] = [];

    if (source === 'crawl') {
      // Import from crawled data
      let query: any = {};

      if (filters) {
        if (filters.country) query.country = filters.country;
        if (filters.category) query.category = filters.category;
        if (filters.ids && filters.ids.length > 0) {
          query._id = { $in: filters.ids };
        }
      }

      const crawledData = await Data.find(query).lean();

      customersToImport = crawledData.map((item: any) => ({
        name: item.name,
        phoneNumber: item.phoneNumber || item.phoneNNumber, // Handle old typo field name
        email: item.email,
        instagram: item.instagram,
        address: item.address || item.adress, // Handle old typo field name
        description: item.description,
        country: item.country || 'Unknown',
        category: item.category || 'other',
        source: 'crawl',
        status: 'new',
        notes: [],
        contactHistory: []
      }));
    } else if (source === 'excel') {
      // Import from Excel data (already parsed)
      customersToImport = importData.map((item: any) => ({
        name: item.name || item.Name || '',
        phoneNumber: item.phoneNumber || item.phone || item.Phone || item.PhoneNumber || '',
        email: item.email || item.Email || '',
        instagram: item.instagram || item.Instagram || '',
        address: item.address || item.Address || '',
        description: item.description || item.Description || '',
        country: item.country || item.Country || '',
        category: item.category || item.Category || 'other',
        source: 'excel',
        status: 'new',
        notes: [],
        contactHistory: []
      }));
    } else if (source === 'manual') {
      // Manual import (single or multiple)
      customersToImport = Array.isArray(importData) ? importData : [importData];
      customersToImport = customersToImport.map((item: any) => ({
        ...item,
        source: 'manual',
        status: item.status || 'new',
        notes: item.notes || [],
        contactHistory: item.contactHistory || []
      }));
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid source type' },
        { status: 400 }
      );
    }

    // Filter out invalid entries
    const validCustomers = customersToImport.filter(
      customer => customer.name && customer.phoneNumber
    );
    
    console.log('Valid customers after filter:', validCustomers.length);
    console.log('Invalid customers:', customersToImport.length - validCustomers.length);

    if (validCustomers.length === 0) {
      console.log('No valid customers. Sample of invalid data:', JSON.stringify(customersToImport.slice(0, 3), null, 2));
      return NextResponse.json(
        { success: false, error: 'No valid customers to import. Make sure crawled data has name and phoneNumber fields.' },
        { status: 400 }
      );
    }

    // Check for duplicates and insert new customers
    const results = {
      imported: 0,
      skipped: 0,
      errors: 0,
      duplicates: [] as string[]
    };

    for (const customerData of validCustomers) {
      try {
        // Check if customer already exists
        const existing = await Customer.findOne({ phoneNumber: customerData.phoneNumber });

        if (existing) {
          results.skipped++;
          results.duplicates.push(customerData.phoneNumber);
          continue;
        }

        await Customer.create(customerData);
        results.imported++;
      } catch (error) {
        console.error('Error importing customer:', error);
        results.errors++;
      }
    }

    return NextResponse.json({
      success: true,
      results: {
        total: validCustomers.length,
        imported: results.imported,
        skipped: results.skipped,
        errors: results.errors,
        duplicates: results.duplicates
      }
    });
  } catch (error) {
    console.error('Error importing customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to import customers' },
      { status: 500 }
    );
  }
}
