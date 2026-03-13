import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { User, Payment, MemberDocument } from '@/lib/types'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeft, Upload, Download, Trash, File, FileText, Receipt, IdentificationCard, Folder } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface MemberProfileProps {
  memberId: string
  onBack: () => void
}

export function MemberProfile({ memberId, onBack }: MemberProfileProps) {
  const { user: currentUser, isAdmin } = useAuth()
  const [members] = useKV<User[]>('system-users', [])
  const [payments] = useKV<Payment[]>('payments', [])
  const [documents, setDocuments] = useKV<MemberDocument[]>('member-documents', [])
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState<{
    category: MemberDocument['category']
    description: string
    file: File | null
  }>({
    category: 'other',
    description: '',
    file: null,
  })

  const member = members?.find(m => m.id === memberId)
  const memberPayments = payments?.filter(p => p.neighborId === memberId) || []
  const memberDocuments = documents?.filter(d => d.memberId === memberId) || []
  const totalPaid = memberPayments.reduce((sum, p) => sum + p.amount, 0)
  const canManageDocuments = isAdmin || currentUser?.id === memberId

  if (!member) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Member not found</p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="mr-2" size={18} />
          Go Back
        </Button>
      </div>
    )
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    setUploadForm(prev => ({ ...prev, file }))
  }

  const handleUpload = async () => {
    if (!uploadForm.file || !currentUser) {
      toast.error('Please select a file')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const fileData = reader.result as string
      const newDocument: MemberDocument = {
        id: Date.now().toString(),
        memberId,
        fileName: uploadForm.file!.name,
        fileType: uploadForm.file!.type,
        fileSize: uploadForm.file!.size,
        category: uploadForm.category,
        description: uploadForm.description,
        uploadedBy: currentUser.email,
        uploadedAt: new Date().toISOString(),
        fileData,
      }

      setDocuments((current) => [...(current || []), newDocument])
      toast.success('Document uploaded successfully')
      setIsUploadDialogOpen(false)
      setUploadForm({
        category: 'other',
        description: '',
        file: null,
      })
    }
    reader.readAsDataURL(uploadForm.file)
  }

  const handleDownload = (doc: MemberDocument) => {
    const link = document.createElement('a')
    link.href = doc.fileData
    link.download = doc.fileName
    link.click()
  }

  const handleDelete = (docId: string) => {
    setDocuments((current) => (current || []).filter(d => d.id !== docId))
    toast.success('Document deleted')
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getCategoryIcon = (category: MemberDocument['category']) => {
    switch (category) {
      case 'contract':
        return <FileText size={18} className="text-primary" />
      case 'receipt':
        return <Receipt size={18} className="text-accent" />
      case 'identification':
        return <IdentificationCard size={18} className="text-secondary" />
      default:
        return <Folder size={18} className="text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2" size={18} />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {member.firstName} {member.lastName}
          </h1>
          <p className="text-sm text-muted-foreground">
            House #{member.houseNumber} · {member.email}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Member Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant={member.isActive ? 'default' : 'destructive'}>
                {member.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Ownership</span>
              <Badge variant="outline" className="capitalize">
                {member.ownershipStatus}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Role</span>
              <Badge variant="secondary" className="capitalize">
                {member.role}
              </Badge>
            </div>

            {member.phoneNumber && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Phone</div>
                <div className="font-mono text-sm">{member.phoneNumber}</div>
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="text-sm text-muted-foreground mb-1">Account Balance</div>
              <div className={`text-2xl font-bold font-mono ${member.balance < 0 ? 'text-destructive' : 'text-accent'}`}>
                ${member.balance.toFixed(2)}
              </div>
            </div>

            <div className="pt-2">
              <div className="text-sm text-muted-foreground mb-1">Total Payments</div>
              <div className="text-xl font-bold font-mono text-primary">
                ${totalPaid.toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Complete payment record for this member</CardDescription>
          </CardHeader>
          <CardContent>
            {memberPayments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No payments recorded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="hidden md:block rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Concept</TableHead>
                        <TableHead>Bank Account</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {memberPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-mono text-sm">
                            {format(new Date(payment.date), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell>{payment.concept || 'Payment'}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {payment.bankAccount || 'N/A'}
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold text-accent">
                            ${payment.amount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="md:hidden space-y-3">
                  {memberPayments.map((payment) => (
                    <Card key={payment.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium">{payment.concept || 'Payment'}</div>
                            <div className="text-sm text-muted-foreground font-mono">
                              {format(new Date(payment.date), 'MMM dd, yyyy')}
                            </div>
                          </div>
                          <div className="font-mono font-semibold text-accent text-lg">
                            ${payment.amount.toFixed(2)}
                          </div>
                        </div>
                        {payment.bankAccount && (
                          <div className="text-xs text-muted-foreground font-mono">
                            Account: {payment.bankAccount}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Contracts, receipts, and identification files</CardDescription>
            </div>
            {canManageDocuments && (
              <Button onClick={() => setIsUploadDialogOpen(true)}>
                <Upload className="mr-2" size={18} />
                Upload Document
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {memberDocuments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <File size={48} className="mx-auto mb-3 opacity-50" />
              <p>No documents uploaded yet</p>
              {canManageDocuments && (
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(true)} className="mt-4">
                  <Upload className="mr-2" size={18} />
                  Upload First Document
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="hidden md:block rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memberDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(doc.category)}
                            <span className="font-medium">{doc.fileName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {doc.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                          {doc.description || '-'}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {formatFileSize(doc.fileSize)}
                        </TableCell>
                        <TableCell>
                          <div>{format(new Date(doc.uploadedAt), 'MMM dd, yyyy')}</div>
                          <div className="text-xs text-muted-foreground">{doc.uploadedBy}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleDownload(doc)}>
                              <Download size={18} />
                            </Button>
                            {canManageDocuments && (
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                                <Trash size={18} />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden space-y-3">
                {memberDocuments.map((doc) => (
                  <Card key={doc.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        {getCategoryIcon(doc.category)}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{doc.fileName}</div>
                          <Badge variant="outline" className="capitalize text-xs mt-1">
                            {doc.category}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground font-mono shrink-0">
                          {formatFileSize(doc.fileSize)}
                        </div>
                      </div>
                      {doc.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {doc.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span>{format(new Date(doc.uploadedAt), 'MMM dd, yyyy')}</span>
                        <span>{doc.uploadedBy}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleDownload(doc)} className="flex-1">
                          <Download size={16} className="mr-1" />
                          Download
                        </Button>
                        {canManageDocuments && (
                          <Button variant="outline" size="sm" onClick={() => handleDelete(doc.id)}>
                            <Trash size={16} />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Add a new document for {member.firstName} {member.lastName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">File</Label>
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <p className="text-xs text-muted-foreground">
                Maximum file size: 5MB. Supported formats: PDF, DOC, DOCX, JPG, PNG
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={uploadForm.category}
                onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value as MemberDocument['category'] }))}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="receipt">Receipt</SelectItem>
                  <SelectItem value="identification">Identification</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={uploadForm.description}
                onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Add a description for this document..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!uploadForm.file}>
              <Upload className="mr-2" size={16} />
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
