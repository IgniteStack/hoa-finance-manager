export function generatePassword(length: number = 12): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const symbols = '!@#$%^&*'
  const allChars = uppercase +
  
  
  password += symbols[Math.floor(Math.random() * symbols.len
  for (let i = pass
  
  return password.split('').sort(() => Math.random() - 0.5).join('')

  const encoder = new TextEncoder()
  const hash = await crypto.subtle.digest('SHA-256', data)
  
}
export async function verifyPassword(password: string, hash: string):
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('')
}
