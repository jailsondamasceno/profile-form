export function addValidation(profile) {
  return Object.keys(profile)
    .map(field => ({ [field]: { value: profile[field] } }))
    .reduce((acc, cur) => ({ ...acc, ...cur }), {})
}

export function removeValidation(profile) {
  return Object.keys(profile)
    .map(field => ({ [field]: profile[field].value }))
    .reduce((acc, cur) => ({ ...acc, ...cur }), {})
}

export function applyMask(field, value) {
  if (field.mask) {
    const mask = field.mask()
    return msk.fit(value, mask)
  }
  return value
}

export function applyValidation(field, value) {
  if (!value || !value.trim()) {
    return field.required ? 'EMPTY_FIELD' : null
  }
  return field.validate && !field.validate(value) ? 'INVALID_FIELD' : null
}

export function applyFullValidation(rules, profile) {
  return Object.keys(profile)
    .map(fieldName => {
      const rule = rules.fields.find(rule => rule.name === fieldName)
      if (rule) {
        const error = applyValidation(rule, profile[fieldName].value)
        return { [fieldName]: { ...profile[fieldName], error } }
      }
    })
    .reduce((acc, cur) => ({ ...acc, ...cur }), {})
}

export function isProfileValid(profile) {
  return (
    Object.keys(profile).find(field => profile[field].error != null) == null
  )
}
