import { useState } from 'react'
import { User, Payment, MemberDocument } fr
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescriptio
import { Textarea } from '@/components/ui/texta
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/s
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeft, Upload, Download, Trash, File, FileText, Receipt, IdentificationCard, Folder } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface MemberProfileProps {
  const [isUploadD
  onBack: () => void
 

export function MemberProfile({ memberId, onBack }: MemberProfileProps) {
  const [members] = useKV<User[]>('system-users', [])
  })
  const [documents, setDocuments] = useKV<MemberDocument[]>('member-documents', [])
  const memberPayments = payments?.filter(p => p.n
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState<{
    category: MemberDocument['category']
    const file = e.targ
    file: File | null
  }>({
    category: 'other',
      setUploadForm(
    file: null,


  const member = members?.find(m => m.id === memberId)
  const memberPayments = payments?.filter(p => p.neighborId === memberId) || []
  const memberDocuments = documents?.filter(d => d.memberId === memberId) || []
  const totalPaid = memberPayments.reduce((sum, p) => sum + p.amount, 0)
  const canManageDocuments = isAdmin || currentUser?.id === memberId

        fileSize: uploadForm.file!.size,
    const file = e.target.files?.[0]
        uploade
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      t
      setUploadForm(prev => ({ ...prev, file }))
     
  }

  const handleUpload = async () => {
  }

    const link = document.createEle
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
    if (bytes < 1024 * 1024) retur
      setUploadForm({

        description: '',
      <Card>
      })
     
    reader.readAsDataURL(uploadForm.file)
   

  const handleDownload = (doc: MemberDocument) => {
    const link = document.createElement('a')
  return (

                
                  {member.isActive ? 'Ac
   

              <div className="text-sm text-
                ${member.balance.toFixed(2)}
            </div>
   

              </div>
          </CardContent

          <CardHeader>
            <CardDesc
          <CardContent>
              <div className
              </div>
              
                  <Table>
     
   

                    </TableHeader>
                      {memberPayments.map
                          <TableCell className="font-mono text-sm">
                          </TableCell>
   

                
            
            
                </div>
                <div className="md:hidden space-y-3">
                    <Card key={payment.id}>
                        <div className="flex justify
                           
                   
                      
             
     
   

          
         
              </div>
          </CardContent>
      </div>
      <Card cla

              <CardTitle>Documents</CardTitle>
            </div>
              <Button 
                Upload Document
            )}
        </CardHeader>
          {member
              <File size={48} className="mx-auto m
              {canManageDocuments && (
                  <U
                </Button>
            </div>
            <div cla
                <T

                      <TableHead>Catego
                      <TableHead>Size</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                  </TableHeader>
                    
              
                            {getCategoryIcon(doc.category)}
                          </div>
                        <TableCell>
                    

                          {doc.description || '-'}
                        <TableCell className="font-mono text-sm">
                        </TableCell>
                          <div>{format(new
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                                <Trash size={18} />
                            )}
                        </Table
                    ))}
                </Ta

                {memberDocuments.map((doc) => (
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={member.isActive ? 'default' : 'destructive'}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
                  

                        <p classNa
              <div className="text-sm text-muted-foreground mb-1">Account Balance</div>
              <div className={`text-2xl font-bold font-mono ${member.balance < 0 ? 'text-destructive' : 'text-accent'}`}>
                ${member.balance.toFixed(2)}
              </div>
                  

            <div className="pt-2">
              <div className="text-sm text-muted-foreground mb-1">Total Payments</div>
              <div className="text-xl font-bold font-mono text-primary">
                ${totalPaid.toFixed(2)}
              </div>
            </div>
          </CardContent>
      <Dialog o

        <Card className="md:col-span-2">
          <CardHeader>
          
            <CardDescription>Complete payment record for this member</CardDescription>
              <Input
          <CardContent>
                accept=".pdf,.doc,.docx,.jpg
              <div className="text-center py-8 text-muted-foreground">
                <p>No payments recorded yet</p>
              )}
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

                    </TableHeader>
                id="description
                      {memberPayments.map((payment) => (
                rows={3}
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

                    </TableBody>

                </div>

                <div className="md:hidden space-y-3">

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

                      </CardContent>
                    </Card>
                  ))}

              </div>

          </CardContent>

      </div>


        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Contracts, receipts, and identification files</CardDescription>
            </div>

              <Button onClick={() => setIsUploadDialogOpen(true)}>
                <Upload className="mr-2" size={18} />
                Upload Document

            )}

        </CardHeader>

          {memberDocuments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <File size={48} className="mx-auto mb-3 opacity-50" />

              {canManageDocuments && (
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(true)} className="mt-4">
                  <Upload className="mr-2" size={18} />
                  Upload First Document
                </Button>

            </div>

            <div className="space-y-4">
              <div className="hidden md:block rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Size</TableHead>

                      <TableHead className="text-right">Actions</TableHead>

                  </TableHeader>

                    {memberDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(doc.category)}
                            <span className="font-medium">{doc.fileName}</span>
                          </div>

                        <TableCell>

                            {doc.category}
                          </Badge>

                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                          {doc.description || '-'}
                        </TableCell>
                        <TableCell className="font-mono text-sm">

                        </TableCell>

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

                            )}

                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>


              <div className="md:hidden space-y-3">
                {memberDocuments.map((doc) => (

                    <CardContent className="p-4">

                        {getCategoryIcon(doc.category)}

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

                        </p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">


                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleDownload(doc)} className="flex-1">
                          <Download size={16} className="mr-1" />
                          Download
                        </Button>
                        {canManageDocuments && (
                          <Button variant="outline" size="sm" onClick={() => handleDelete(doc.id)}>

                          </Button>

                      </div>

                  </Card>

              </div>

          )}

      </Card>

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Add a new document for {member.firstName} {member.lastName}
            </DialogDescription>

          














            </div>










































        </DialogContent>

    </div>

}
