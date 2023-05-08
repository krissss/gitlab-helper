export function jsonSafeParse(json: string | object): string | object {
  if (typeof json === 'string') {
    try {
      return JSON.parse(json)
    }
    catch (e) {
      return json
    }
  }
  return json
}

export function jsonSafeStringify(json: string | object): string {
  if (typeof json === 'object') {
    return JSON.stringify(json)
  }
  return json
}
