import { NextRequest, NextResponse } from 'next/server';
import connect from "../../../../lib/data"
import Data from '../../../../models/data';

export async function GET(request: NextRequest) {
  try {
    await connect();

    const count = await Data.countDocuments();
    const sample = await Data.findOne().lean();

    return NextResponse.json({
      success: true,
      totalCount: count,
      sampleData: sample,
      fieldNames: sample ? Object.keys(sample) : []
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch debug info' },
      { status: 500 }
    );
  }
}
