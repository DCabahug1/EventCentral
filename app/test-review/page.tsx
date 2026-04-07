'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createReview, } from '@/lib/reviews'
import { PostgrestError } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import React, { useState } from 'react'

function page() {
  const [formData, setFormData] = useState({
    event_id: 0,
    rating: 5,
    review: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const checkIfEventExists = async (event_id: number) => {
    const supabase = createClient()
    const result = await supabase.from('events').select('*').eq('id', event_id).single()

    if (result.error) {
      console.error("Error checking if event exists: ", result.error)
      setErrorMessage("Error checking if event exists")
      return false;
    }

    console.log("Event found: ", result.data !== null)

    return result.data !== null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    if (!await checkIfEventExists(formData.event_id)) {
      setErrorMessage('Event not found');
      return;
    }

    try {
      const result = await createReview({
        rating: formData.rating,
        content: formData.review,
        event_id: formData.event_id,
      })

      if (result instanceof Error || result instanceof PostgrestError) {
        setErrorMessage(result.message);
        return;
      }

      if (result) {
        setSuccessMessage('Review created successfully');
        setFormData({
          event_id: 0,
          rating: 0,
          review: '',
        })
      }
    } catch (error) {
      setErrorMessage('There was an error creating the review');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='flex items-center justify-center h-screen'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Test Review</CardTitle>
        </CardHeader>
        <CardContent>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel>Event ID</FieldLabel>
                <FieldContent>
                  <Input type='number' required placeholder='Enter the event ID' value={formData.event_id} onChange={(e) => setFormData({ ...formData, event_id: parseInt(e.target.value) })} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Rating</FieldLabel>
                <FieldContent>
                  <Input type='number' min={1} max={5} required placeholder='Enter your rating (1-5)' value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Review</FieldLabel>
                <FieldContent>
                  <Textarea required placeholder='Enter your review' value={formData.review} onChange={(e) => setFormData({ ...formData, review: e.target.value })} />
                </FieldContent>
              </Field>
              {errorMessage && <FieldError>{errorMessage}</FieldError>}
              {successMessage && <p className='text-green-500'>{successMessage}</p>}
              <Field>
                <Button type='submit' disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</Button>
              </Field>
            </FieldGroup>
            
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default page