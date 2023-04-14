export function shortId(id: string) {
  function shortDotSeparatedString(str: string) {
    const parts = str.split('.')
    return parts
      .map((part) => {
        if (part.length > 10) {
          return part.substring(0, 3) + '...' + part.substring(part.length - 3)
        } else {
          return part
        }
      })
      .join('.')
  }

  const parts = id.split(':')
  return parts
    .map((part) => {
      if (part.length > 41) {
        const str = shortDotSeparatedString(part)
        if (part !== str) return str
        return str.substring(0, 7) + '...' + str.substring(str.length - 5)
      } else {
        return part
      }
    })
    .join(':')
}
