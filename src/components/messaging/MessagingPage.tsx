import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ChatCircle, PaperPlaneTilt } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function MessagingPage() {
  const [message, setMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const { isAdmin } = useAuth()

  const handleSend = async () => {
    if (!message.trim()) return

    setIsGenerating(true)
    
    try {
      const promptText = `You are a helpful HOA community manager assistant. The admin wants to send the following message to the community: "${message}"

Please generate a professional, friendly WhatsApp message suitable for sending to the community group. Keep it concise and clear.`
      
      const generatedMessage = await window.spark.llm(promptText, 'gpt-4o-mini')
      
      toast.success('Message prepared! (Would be sent to WhatsApp group)')
      toast.info(generatedMessage, { duration: 8000 })
      setMessage('')
    } catch (error) {
      toast.error('Failed to generate message')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleQuickCommand = async (command: string) => {
    setIsGenerating(true)
    
    try {
      const promptText = `You are a helpful HOA community manager assistant. Generate a professional WhatsApp message for the following purpose: "${command}"

The message should be suitable for sending to a residential community group. Be friendly, clear, and concise.`
      
      const generatedMessage = await window.spark.llm(promptText, 'gpt-4o-mini')
      setMessage(generatedMessage)
      toast.success('Message generated!')
    } catch (error) {
      toast.error('Failed to generate message')
    } finally {
      setIsGenerating(false)
    }
  }

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <ChatCircle size={48} className="mx-auto mb-4 opacity-50" />
          <p>Only admins can send messages to the community</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Community Messaging</CardTitle>
          <CardDescription>
            Send announcements to the community WhatsApp group with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message or use a quick command below..."
              rows={6}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickCommand('send payment reminder for monthly dues')}
                disabled={isGenerating}
              >
                Payment Reminder
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickCommand('report this months expenses summary')}
                disabled={isGenerating}
              >
                Expense Report
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickCommand('notify neighbors about upcoming community meeting this Saturday at 10 AM')}
                disabled={isGenerating}
              >
                Meeting Notice
              </Button>
            </div>

            <Button onClick={handleSend} disabled={!message.trim() || isGenerating}>
              {isGenerating ? 'Processing...' : (
                <>
                  <PaperPlaneTilt className="mr-2" size={18} weight="fill" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}