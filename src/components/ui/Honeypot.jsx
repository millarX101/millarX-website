/**
 * Honeypot field for spam prevention
 *
 * This is a hidden field that bots will fill out but humans won't see.
 * If this field has a value on submission, the form is likely spam.
 *
 * Usage:
 * 1. Add <Honeypot value={formData.website} onChange={handleChange} /> to your form
 * 2. Add 'website: ""' to your form state
 * 3. Check if formData.website is filled before submitting - if so, silently reject
 */

export default function Honeypot({ value, onChange, name = 'website' }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        opacity: 0,
        height: 0,
        width: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
      tabIndex={-1}
    >
      <label htmlFor={name}>
        Website (leave blank)
        <input
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete="off"
          tabIndex={-1}
        />
      </label>
    </div>
  )
}

/**
 * Helper function to check if honeypot was triggered
 * Returns true if the submission appears to be spam
 */
export function isSpamSubmission(honeypotValue) {
  return honeypotValue && honeypotValue.length > 0
}
