import { NextRequest, NextResponse } from 'next/server';
import connect from "../../../../lib/data"
import Customer from '@/models/Customer';

// GET - Fetch customers with filters
export async function GET(request: NextRequest) {
    try {
        await connect();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const category = searchParams.get('category');
        const country = searchParams.get('country');
        const search = searchParams.get('search');
        const source = searchParams.get('source');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        // Build filter query
        const filter: any = {};
        if (status) filter.status = status;
        if (category) filter.category = category;
        if (country) filter.country = country;
        if (source) filter.source = source;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { phoneNumber: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Get total count for pagination
        const total = await Customer.countDocuments(filter);

        // Fetch customers with pagination
        const customers = await Customer.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit)
            .lean();

        return NextResponse.json({
            success: true,
            customers,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch customers' },
            { status: 500 }
        );
    }
}

// POST - Create new customer
export async function POST(request: NextRequest) {
    try {
        await connect();

        const body = await request.json();
        const {
            name,
            phoneNumber,
            email,
            instagram,
            address,
            description,
            country,
            category,
            source = 'manual'
        } = body;

        // Validation
        if (!name || !phoneNumber || !country || !category) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: name, phoneNumber, country, category' },
                { status: 400 }
            );
        }

        // Check if customer already exists
        const existingCustomer = await Customer.findOne({ phoneNumber });
        if (existingCustomer) {
            return NextResponse.json(
                { success: false, error: 'Customer with this phone number already exists' },
                { status: 409 }
            );
        }

        const customer = await Customer.create({
            name,
            phoneNumber,
            email,
            instagram,
            address,
            description,
            country,
            category,
            source,
            status: 'new',
            notes: [],
            contactHistory: []
        });

        return NextResponse.json({
            success: true,
            customer
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating customer:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create customer' },
            { status: 500 }
        );
    }
}
