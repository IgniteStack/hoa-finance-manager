export function generatePassword(length: number = 12): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const symbols = '!@#$%^&*'
  
  const symbols = '!@#$%^&*'
  const allChars = uppercase + lowercase + numbers + symbols
  
  let password = ''
  
}
export async function hashPassword(password: string): Promise<str
  const data = encoder.encode(password)
  
  return hashHex

  c
}
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)









