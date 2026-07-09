'use client'

import {FormEvent, useRef, useState} from 'react'

type ApplicationFormField = {
  _key?: string
  label?: string
  fieldId?: string
  inputType?: 'text' | 'email' | 'tel' | 'number' | 'select' | 'yesNo' | 'textarea'
  required?: boolean
  options?: string[]
  rows?: number
}

export type ApplicationFormLabels = {
  heading?: string
  recipientEmail?: string
  nameLabel?: string
  emailLabel?: string
  postcodeLabel?: string
  phoneLabel?: string
  ageLabel?: string
  projectLabel?: string
  projectOptions?: string[]
  madeFilmLabel?: string
  aboutLabel?: string
  groupLabel?: string
  datesLabel?: string
  submitLabel?: string
  fields?: ApplicationFormField[]
}

const defaultProjectOptions = ['SEL Mind (South East London // 18-30 age) - Therapeutic Filmmaking']

function defaultFields(labels?: ApplicationFormLabels | null): ApplicationFormField[] {
  const projectOptions = labels?.projectOptions?.length ? labels.projectOptions : defaultProjectOptions

  return [
    {fieldId: 'name', label: labels?.nameLabel || 'Name', inputType: 'text', required: true},
    {fieldId: 'email', label: labels?.emailLabel || 'Email', inputType: 'email', required: true},
    {fieldId: 'postcode', label: labels?.postcodeLabel || 'Postcode', inputType: 'text', required: true},
    {fieldId: 'phone', label: labels?.phoneLabel || 'Phone Number', inputType: 'tel', required: true},
    {fieldId: 'age', label: labels?.ageLabel || 'Age', inputType: 'number'},
    {
      fieldId: 'project',
      label: labels?.projectLabel || 'Which project are you applying for?',
      inputType: 'select',
      required: true,
      options: projectOptions,
    },
    {fieldId: 'madeFilm', label: labels?.madeFilmLabel || 'Have you made a film before?', inputType: 'yesNo'},
    {
      fieldId: 'about',
      label: labels?.aboutLabel || 'Tell us something about yourself? Why do you want to join the project? (aim for 300 words)',
      inputType: 'textarea',
      required: true,
      rows: 6,
    },
    {
      fieldId: 'groupActivity',
      label: labels?.groupLabel || 'How do you feel about joining a group activity? Do you have any specific needs or access requirements?',
      inputType: 'textarea',
      required: true,
      rows: 5,
    },
    {fieldId: 'unavailableDates', label: labels?.datesLabel || 'Are there any dates you cannot attend?', inputType: 'textarea', rows: 4},
  ]
}

function autoCompleteFor(fieldId?: string) {
  if (fieldId === 'name') return 'name'
  if (fieldId === 'email') return 'email'
  if (fieldId === 'postcode') return 'postal-code'
  if (fieldId === 'phone') return 'tel'
  return undefined
}

export function ApplicationForm({labels}: {labels?: ApplicationFormLabels | null}) {
  const recipientEmail = labels?.recipientEmail || 'contact@wondering.com'
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const formRef = useRef<HTMLFormElement | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sending')

    const formData = new FormData(event.currentTarget)
    const fields = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, String(value)]),
    )

    try {
      const response = await fetch('/api/form-submit', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          formName: 'Wondering application form',
          recipientEmail,
          fields,
        }),
      })

      if (!response.ok) throw new Error('Unable to submit form')

      formRef.current?.reset()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const fields = labels?.fields?.length ? labels.fields : defaultFields(labels)

  return (
    <form
      className="contact-form contact-form--application"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      {fields.map((field, index) => {
        const fieldId = field.fieldId || `field-${index + 1}`
        const label = field.label || 'Untitled field'
        const labelText = `${label}${field.required ? ' *' : ''}`
        const key = field._key || fieldId

        if (field.inputType === 'yesNo') {
          return (
            <fieldset className="contact-form__fieldset" key={key}>
              <legend>{labelText}</legend>
              <div className="contact-form__switch" role="radiogroup" aria-label={label}>
                <label>
                  <input name={fieldId} required={field.required} type="radio" value="Yes" />
                  <span>Yes</span>
                </label>
                <label>
                  <input name={fieldId} required={field.required} type="radio" value="No" />
                  <span>No</span>
                </label>
              </div>
            </fieldset>
          )
        }

        if (field.inputType === 'select') {
          const options = field.options?.length ? field.options : defaultProjectOptions

          return (
            <label key={key}>
              <span>{labelText}</span>
              <select defaultValue="" name={fieldId} required={field.required}>
                <option disabled value="">
                  Select
                </option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          )
        }

        if (field.inputType === 'textarea') {
          return (
            <label className="contact-form__message" key={key}>
              <span>{labelText}</span>
              <textarea name={fieldId} required={field.required} rows={field.rows || 4} />
            </label>
          )
        }

        return (
          <label key={key}>
            <span>{labelText}</span>
            <input
              autoComplete={autoCompleteFor(fieldId)}
              inputMode={field.inputType === 'number' ? 'numeric' : undefined}
              name={fieldId}
              required={field.required}
              type={field.inputType === 'email' || field.inputType === 'tel' ? field.inputType : 'text'}
            />
          </label>
        )
      })}
      {status === 'success' ? (
        <p className="contact-form__status">Form is submitted, thank you.</p>
      ) : (
        <button className="contact-form__submit button-link small-copy" disabled={status === 'sending'} type="submit">
          <span className="button-link__text-mask">
            <span className="button-link__text">{status === 'sending' ? 'Sending' : labels?.submitLabel || 'Submit application'}</span>
          </span>
          <span aria-hidden="true" className="button-link__icon">
            <span className="button-link__icon-bg" />
            <span className="button-link__icon-mask">
              <span className="button-link__icon-track">
                <span className="button-link__arrow" />
                <span className="button-link__arrow" />
                <span className="button-link__arrow" />
              </span>
            </span>
          </span>
          <span aria-hidden="true" className="button-link__hover-bg" />
        </button>
      )}
      {status === 'error' ? <p className="contact-form__status">Something went wrong. Please try again.</p> : null}
    </form>
  )
}
