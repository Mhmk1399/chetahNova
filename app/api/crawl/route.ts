import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
  try {
    const { url, crawlAllPages = false } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const allBusinesses: any[] = [];
    let totalPages = 1;
    let pagesCrawled = 0;

    // Helper function to extract businesses from a page
    const extractBusinessesFromPage = async (pageUrl: string) => {
      const response = await axios.get(pageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);
      const businesses: any[] = [];
    
    // Look for all elements that contain business information
    // Common patterns: article tags, divs with specific classes, or schema.org markup
    let businessContainers = $('[itemtype*="schema.org"], article, .business-item, .listing-item').length > 0
      ? $('[itemtype*="schema.org"], article, .business-item, .listing-item')
      : $('body').children().filter((_, el) => {
          // Fallback: find containers that have both name and phone elements
          return $(el).find('h2[itemprop="name"], a[href^="tel:"]').length > 0;
        });

    if (businessContainers.length === 0) {
      // If no containers found, extract single business from entire page
      businessContainers = $('body');
    }

    businessContainers.each((index, container) => {
      const $container = $(container);
      
      // Extract name
      const name = $container.find('h2[itemprop="name"]').first().text().trim() || 
                   $container.find('h2.text-\\[18px\\].font-medium').first().text().trim() ||
                   $container.find('h2').first().text().trim() || '';

      // Skip if no name found (might be an irrelevant container)
      if (!name) return;

      // Extract phone number
      const phoneNumber = $container.find('a[itemprop="telephone"]').first().attr('href')?.replace('tel:', '').trim() || 
                         $container.find('a[href^="tel:"]').first().attr('href')?.replace('tel:', '').trim() || '';

      // Extract Instagram
      const instagramLink = $container.find('a[itemprop="sameAs"][href*="instagram"]').first().attr('href') || 
                           $container.find('a[href*="instagram.com"]').first().attr('href') || '';
      
      const instagram = instagramLink ? 
                       (instagramLink.includes('instagram.com/') ? 
                        '@' + instagramLink.split('instagram.com/')[1].split(/[/?]/)[0] : 
                        instagramLink) : '';

      // Extract description
      const description = $container.find('h3[itemprop="description"]').first().text().trim() || 
                         $container.find('h3.text-\\[16px\\]').first().text().trim() ||
                         $container.find('p').first().text().trim() || '';

      // Extract address
      const address = $container.find('[itemprop="address"]').first().text().trim() ||
                     $container.find('address').first().text().trim() ||
                     $container.find('p:contains("آدرس"), p:contains("Address")').first().text().replace(/آدرس:|Address:/gi, '').trim() || '';

      // Extract email
      const emailElement = $container.find('a[href^="mailto:"]').first().attr('href')?.replace('mailto:', '') ||
                          $container.find('[itemprop="email"]').first().text().trim() || '';
      
      let email = emailElement;
      if (!email) {
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const containerText = $container.text();
        const emailMatches = containerText.match(emailRegex);
        email = emailMatches ? emailMatches[0] : '';
      }

      businesses.push({
        name,
        phoneNumber,
        instagram,
        address,
        email,
        description,
      });
    });

      return { businesses, $ };
    };

    // Crawl first page
    const { businesses: firstPageBusinesses, $: firstPage$ } = await extractBusinessesFromPage(url);
    allBusinesses.push(...firstPageBusinesses);
    pagesCrawled++;

    // If crawlAllPages is enabled, detect and crawl remaining pages
    if (crawlAllPages) {
      const paginationNav = firstPage$('nav[aria-label*="صفحه"], nav.pagination, .pagination');
      
      if (paginationNav.length > 0) {
        const lastPageLink = paginationNav.find('a[rel="last"]').first();
        let lastPageNum = 1;
        
        if (lastPageLink.length > 0) {
          const lastPageHref = lastPageLink.attr('href');
          const pageMatch = lastPageHref?.match(/[?&]page=(\d+)/);
          if (pageMatch) {
            lastPageNum = parseInt(pageMatch[1], 10);
          } else {
            const lastPageText = lastPageLink.text().trim();
            const englishNum = lastPageText.replace(/[۰-۹]/g, (d: string) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
            lastPageNum = parseInt(englishNum, 10) || 1;
          }
        } else {
          const allPageLinks = paginationNav.find('a[href*="page="], a[aria-label*="صفحه"]');
          allPageLinks.each((_, link) => {
            const href = firstPage$(link).attr('href');
            const pageMatch = href?.match(/[?&]page=(\d+)/);
            if (pageMatch) {
              const pageNum = parseInt(pageMatch[1], 10);
              if (pageNum > lastPageNum) {
                lastPageNum = pageNum;
              }
            }
          });
        }

        totalPages = lastPageNum;

        for (let page = 2; page <= totalPages; page++) {
          try {
            const pageUrl = url.includes('?') ? `${url}&page=${page}` : `${url}?page=${page}`;
            const { businesses: pageBusinesses } = await extractBusinessesFromPage(pageUrl);
            allBusinesses.push(...pageBusinesses);
            pagesCrawled++;
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (error) {
            console.error(`Error crawling page ${page}:`, error);
          }
        }
      }
    }

    return NextResponse.json({
      url,
      businesses: allBusinesses,
      count: allBusinesses.length,
      totalPages,
      pagesCrawled,
      crawledAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Crawl error:', error);
    
    if (error.code === 'ENOTFOUND') {
      return NextResponse.json(
        { error: 'Website not found' },
        { status: 404 }
      );
    }
    
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return NextResponse.json(
        { error: 'Request timeout - website took too long to respond' },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to crawl the website: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}
