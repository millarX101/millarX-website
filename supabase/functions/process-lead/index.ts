// Supabase Edge Function: process-lead
// Triggers when a new lead is inserted into quote_requests
// Forwards lead to mxDriveIQ for auto-quoting and CRM integration

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ============================================
// DATA MAPPING: millarX Website → mxDriveIQ
// ============================================
//
// REQUIRED FIELDS FOR MXDRIVEIQ:
// ┌─────────────────────┬──────────────────────────────┬─────────────────────────────────┐
// │ mxDriveIQ Field     │ Website Form Field           │ Source                          │
// ├─────────────────────┼──────────────────────────────┼─────────────────────────────────┤
// │ name                │ name                         │ Step 1: Personal Details        │
// │ email               │ email                        │ Step 1: Personal Details        │
// │ phone               │ phone                        │ Step 1: Personal Details        │
// │ employer            │ employer                     │ Step 2: Employment Details      │
// │ state               │ state                        │ Step 2: Employment Details      │
// │ annualSalary        │ annualSalary                 │ Step 2 (or calculator default)  │
// │ annualKm            │ annualKm                     │ Step 2 (or calculator default)  │
// │ vehicleMake         │ vehicle_make                 │ Step 3: Vehicle Details         │
// │ vehicleModel        │ vehicle_model                │ Step 3: Vehicle Details         │
// │ vehicleVariant      │ vehicle_variant              │ Step 3: Vehicle Details         │
// │ needSourcingHelp    │ need_sourcing_help           │ Step 3: Vehicle Details         │
// │ vehiclePrice        │ calculation_inputs.price     │ Calculator                      │
// │ leaseTermYears      │ calculation_inputs.term      │ Calculator                      │
// │ isEV                │ fuelType === 'Electric'      │ Calculator                      │
// └─────────────────────┴──────────────────────────────┴─────────────────────────────────┘

interface LeadData {
  id: string
  // Contact details (Step 1)
  name: string
  email: string
  phone?: string
  // Employment details (Step 2)
  employer: string
  state: string
  // Vehicle details (Step 3)
  vehicle_make?: string
  vehicle_model?: string
  vehicle_variant?: string
  vehicle_description?: string
  need_sourcing_help: 'yes' | 'no' | 'unsure'
  // Calculator data
  calculation_inputs: {
    vehiclePrice: number
    annualSalary: number
    leaseTermYears: number
    fuelType: string
    annualKm: number
    state: string
    payPeriod: 'weekly' | 'fortnightly' | 'monthly'
    selectedEV?: string
  }
  calculation_results: {
    annualTaxSavings: number
    netCostPerPeriod: number
    totalCostPerPeriod: number
    driveAwayPrice: number
    residualValue: number
    fbtExempt: boolean
    monthlyFinance?: number
    monthlyRunningCosts?: number
    monthlyFBT?: number
  }
  // Tracking
  source: string
  source_page?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  created_at: string
}

// Payload structure for mxDriveIQ API
interface MxDriveIQPayload {
  // REQUIRED: Customer Details
  customer: {
    name: string
    email: string
    phone: string | null
    employer: string
    state: string
    annualSalary: number
    annualKm: number
  }
  // REQUIRED: Vehicle Details
  vehicle: {
    make: string | null
    model: string | null
    variant: string | null
    description: string
    price: number
    isEV: boolean
    needSourcingHelp: 'yes' | 'no' | 'unsure'
  }
  // Lease Configuration
  lease: {
    termYears: number
    payPeriod: string
  }
  // Pre-calculated Estimates (from website calculator)
  estimates: {
    driveAwayPrice: number
    residualValue: number
    annualTaxSavings: number
    netCostPerPeriod: number
    monthlyFinance: number
    monthlyRunningCosts: number
    monthlyFBT: number
    fbtExempt: boolean
  }
  // Tracking & Meta
  meta: {
    websiteLeadId: string
    source: string
    sourcePage: string | null
    utmSource: string | null
    utmMedium: string | null
    utmCampaign: string | null
    createdAt: string
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the lead data from the request body
    const { record, type } = await req.json()

    // Only process INSERT events
    if (type !== 'INSERT') {
      return new Response(
        JSON.stringify({ message: 'Ignored non-INSERT event' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const lead: LeadData = record

    console.log(`Processing new lead: ${lead.id} - ${lead.email}`)

    // Build vehicle description
    const vehicleDescription = [
      lead.vehicle_make,
      lead.vehicle_model,
      lead.vehicle_variant,
    ].filter(Boolean).join(' ') || lead.vehicle_description || lead.calculation_inputs.selectedEV || 'Not specified'

    // Transform to mxDriveIQ payload format
    const payload: MxDriveIQPayload = {
      // REQUIRED: Customer details
      customer: {
        name: lead.name,
        email: lead.email,
        phone: lead.phone || null,
        employer: lead.employer,
        state: lead.state || lead.calculation_inputs.state,
        annualSalary: lead.calculation_inputs.annualSalary,
        annualKm: lead.calculation_inputs.annualKm,
      },

      // REQUIRED: Vehicle details
      vehicle: {
        make: lead.vehicle_make || null,
        model: lead.vehicle_model || null,
        variant: lead.vehicle_variant || null,
        description: vehicleDescription,
        price: lead.calculation_inputs.vehiclePrice,
        isEV: lead.calculation_inputs.fuelType === 'Electric Vehicle',
        needSourcingHelp: lead.need_sourcing_help || 'unsure',
      },

      // Lease configuration
      lease: {
        termYears: lead.calculation_inputs.leaseTermYears,
        payPeriod: lead.calculation_inputs.payPeriod,
      },

      // Pre-calculated estimates from website
      estimates: {
        driveAwayPrice: lead.calculation_results.driveAwayPrice,
        residualValue: lead.calculation_results.residualValue,
        annualTaxSavings: lead.calculation_results.annualTaxSavings,
        netCostPerPeriod: lead.calculation_results.netCostPerPeriod,
        monthlyFinance: lead.calculation_results.monthlyFinance || 0,
        monthlyRunningCosts: lead.calculation_results.monthlyRunningCosts || 0,
        monthlyFBT: lead.calculation_results.monthlyFBT || 0,
        fbtExempt: lead.calculation_results.fbtExempt,
      },

      // Tracking metadata
      meta: {
        websiteLeadId: lead.id,
        source: lead.source || 'millarx-website',
        sourcePage: lead.source_page || null,
        utmSource: lead.utm_source || null,
        utmMedium: lead.utm_medium || null,
        utmCampaign: lead.utm_campaign || null,
        createdAt: lead.created_at,
      },
    }

    // ============================================
    // MXDRIVEIQ API INTEGRATION
    // ============================================

    const MXDRIVEIQ_API_URL = Deno.env.get('MXDRIVEIQ_API_URL')
    const MXDRIVEIQ_API_KEY = Deno.env.get('MXDRIVEIQ_API_KEY')

    if (MXDRIVEIQ_API_URL && MXDRIVEIQ_API_KEY) {
      console.log(`Forwarding lead to mxDriveIQ: ${MXDRIVEIQ_API_URL}`)

      const apiResponse = await fetch(`${MXDRIVEIQ_API_URL}/api/leads/inbound`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MXDRIVEIQ_API_KEY}`,
          'X-Source': 'millarx-website',
        },
        body: JSON.stringify(payload),
      })

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text()
        console.error(`mxDriveIQ API error: ${apiResponse.status} - ${errorText}`)

        // Update lead status to indicate API failure
        await supabaseClient
          .from('quote_requests')
          .update({
            status: 'api_error',
            api_error: `${apiResponse.status}: ${errorText}`
          })
          .eq('id', lead.id)

        throw new Error(`mxDriveIQ API error: ${apiResponse.status}`)
      }

      const apiResult = await apiResponse.json()
      console.log(`mxDriveIQ response:`, apiResult)

      // Update lead with mxDriveIQ reference
      await supabaseClient
        .from('quote_requests')
        .update({
          status: 'sent_to_crm',
          mxdriveiq_id: apiResult.leadId || apiResult.id,
          quote_generated: apiResult.quoteGenerated || false,
        })
        .eq('id', lead.id)

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Lead forwarded to mxDriveIQ',
          mxdriveiq_id: apiResult.leadId || apiResult.id,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      // API not configured - just log and mark as pending
      console.log('mxDriveIQ API not configured, lead stored locally')
      console.log('Payload ready for API:', JSON.stringify(payload, null, 2))

      await supabaseClient
        .from('quote_requests')
        .update({ status: 'pending_api_config' })
        .eq('id', lead.id)

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Lead stored, awaiting API configuration',
          payload: payload, // Return payload for debugging
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('Error processing lead:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
