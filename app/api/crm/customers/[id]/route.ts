import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/data';
import Customer from '@/models/Customer';

// GET - Fetch single customer
export async function GET(request: NextRequest) {
  try {
    await connect();

    const customerId = request.headers.get('x-customer-id');
    
    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Customer ID is required in x-customer-id header' },
        { status: 400 }
      );
    }

    const customer = await Customer.findById(customerId);
    
    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      customer
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

// PUT - Update customer
export async function PUT(request: NextRequest) {
  try {
    await connect();

    const customerId = request.headers.get('x-customer-id');
    
    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Customer ID is required in x-customer-id header' },
        { status: 400 }
      );
    }

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
      status
    } = body;

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      {
        name,
        phoneNumber,
        email,
        instagram,
        address,
        description,
        country,
        category,
        status
      },
      { new: true, runValidators: true }
    );

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      customer
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

// PATCH - Add note or contact history
export async function PATCH(request: NextRequest) {
  try {
    await connect();

    const customerId = request.headers.get('x-customer-id');
    
    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Customer ID is required in x-customer-id header' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { action, data } = body;

    let customer;

    switch (action) {
      case 'add_note':
        customer = await Customer.findByIdAndUpdate(
          customerId,
          {
            $push: {
              notes: {
                content: data.content,
                createdAt: new Date(),
                createdBy: data.createdBy
              }
            }
          },
          { new: true }
        );
        break;

      case 'add_contact':
        customer = await Customer.findByIdAndUpdate(
          customerId,
          {
            $push: {
              contactHistory: {
                date: data.date || new Date(),
                type: data.type,
                notes: data.notes,
                createdBy: data.createdBy
              }
            },
            lastContactedAt: new Date()
          },
          { new: true }
        );
        break;

      case 'update_status':
        customer = await Customer.findByIdAndUpdate(
          customerId,
          { status: data.status },
          { new: true }
        );
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      customer
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

// DELETE - Delete customer
export async function DELETE(request: NextRequest) {
  try {
    await connect();

    const customerId = request.headers.get('x-customer-id');
    
    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Customer ID is required in x-customer-id header' },
        { status: 400 }
      );
    }

    const customer = await Customer.findByIdAndDelete(customerId);

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
