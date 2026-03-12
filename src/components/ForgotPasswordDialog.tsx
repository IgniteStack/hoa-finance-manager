import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/componen
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'


  const [users, setUsers] = us

  const [securityAnswer, setSecurityA
  const [confir

 

    setNewPassword('')

  }
  const handleEmailSubmit = (e: React.FormEvent) => {
    setError('')
    const user = (users || []).find(u =>
    if (!user) {
      return

      setError('This account does not have a security questi
    }

  }
  const handleSecuri
    setError('')
    if (!foundUser) re
    const hashedAnswer = 
    setNewPassword('')
    setConfirmPassword('')
    setError('')
    onClose()
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (!user) {
      setError('No account found with this email address')
    }
    }

    if (!user.securityQuestion || !user.securityAnswer) {
      setError('This account does not have a security question set up')
      return
    }

    setFoundUser(user)
    setStep('security')
   

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!foundUser) return

    const hashedAnswer = await hashPassword(securityAnswer.toLowerCase().trim())
    
    if (hashedAnswer !== foundUser.securityAnswer) {
      setError('Incorrect answer to security question')
      return
    }

    setStep('password')
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

  return (
      setError('Password must be at least 8 characters long')
        <Dia
     

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!foundUser) return

    const hashedPassword = await hashPassword(newPassword)
    
              <Label html
      (current || []).map(u =>
        u.id === foundUser.id
          ? { ...u, password: hashedPassword }
          : u
      )
    )

            {error && (
    setStep('success')
   

  const handleBackToEmail = () => {
    setStep('email')
    setFoundUser(null)
    setSecurityAnswer('')
    setError('')
  }

  const handleBackToSecurity = () => {
          <form onSubmi
    setNewPassword('')
    setConfirmPassword('')
    setError('')
  }

          
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'email' && 'Reset Password'}
            {step === 'security' && 'Verify Your Identity'}
            {step === 'password' && 'Create New Password'}
            {step === 'success' && 'Password Reset Complete'}
          </DialogTitle>
          <DialogDescription>
            {step === 'email' && 'Enter your email address to begin password recovery'}
            {step === 'security' && 'Answer your security question to verify your identity'}
            {step === 'password' && 'Choose a new password for your account'}
            {step === 'success' && 'You can now sign in with your new password'}
          </DialogDescription>
  )









































































































































