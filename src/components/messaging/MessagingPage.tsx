import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Neighbor } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { PaperPlaneRight, Users } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface Message {
  id: string
  subject: string
  body: string
  recipients: string[]
  sentAt: string
  sentBy: string
}

export function MessagingPage() {
  const [neighbors] = useKV<Neighbor[]>('neighbors', [])
  const [messages, setMessages] = useKV<Message[]>('messages', [])
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [recipientMode, setRecipientMode] = useState<'all' | 'selective'>('all')

  const activeNeighbors = (neighbors || []).filter(n => n.isActive)

  const handleRecipientToggle = (neighborId: string) => {
    setSelectedRecipients(prev =>
      prev.includes(neighborId)
        ? prev.filter(id => id !== neighborId)
        : [...prev, neighborId]
    )
  }

  const handleSendMessage = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error('Please provide both subject and message body')
      return
    }

    const recipients = recipientMode === 'all'
      ? activeNeighbors.map(n => n.id)
      : selectedRecipients

    if (recipients.length === 0) {
      toast.error('Please select at least one recipient')
      return
    }

    const user = await window.spark.user()

    const newMessage: Message = {
      id: Date.now().toString(),
      subject,
      body,
      recipients,
      sentAt: new Date().toISOString(),
      sentBy: user?.email || 'Admin'
    }

    setMessages(prev => [newMessage, ...(prev || [])])
    
    setSubject('')
    setBody('')
    setSelectedRecipients([])
    setRecipientMode('all')

    toast.success(`Message sent to ${recipients.length} recipient${recipients.length > 1 ? 's' : ''}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messaging</h1>
        <p className="text-muted-foreground mt-1">Send announcements and updates to neighbors</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Compose Message</CardTitle>
              <CardDescription>Create and send messages to your HOA members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <input
                  id="subject"
                  type="text"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  placeholder="Message subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Message</Label>
                <Textarea
                  id="body"
                  placeholder="Write your message here..."
                  className="min-h-[200px]"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Recipients</Label>
                <Select value={recipientMode} onValueChange={(value: 'all' | 'selective') => setRecipientMode(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Active Neighbors</SelectItem>
                    <SelectItem value="selective">Select Specific Neighbors</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {recipientMode === 'selective' && (
                <div className="space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-4">
                  {activeNeighbors.map(neighbor => (
                    <div key={neighbor.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`neighbor-${neighbor.id}`}
                        checked={selectedRecipients.includes(neighbor.id)}
                        onCheckedChange={() => handleRecipientToggle(neighbor.id)}
                      />
                      <label
                        htmlFor={`neighbor-${neighbor.id}`}
                        className="text-sm flex-1 cursor-pointer"
                      >
                        {neighbor.firstName} {neighbor.lastName} - House #{neighbor.houseNumber}
                      </label>
                    </div>
                  ))}
                </div>
              )}

              <Button onClick={handleSendMessage} className="w-full gap-2">
                <PaperPlaneRight size={18} />
                Send Message
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={20} />
                Recipients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeNeighbors.length}</div>
              <p className="text-sm text-muted-foreground">Active neighbors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              {!messages || messages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No messages sent yet</p>
              ) : (
                <div className="space-y-3">
                  {(messages || []).slice(0, 5).map(msg => (
                    <div key={msg.id} className="border-b pb-2 last:border-0">
                      <div className="font-medium text-sm">{msg.subject}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(msg.sentAt).toLocaleDateString()} • {msg.recipients.length} recipients
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
