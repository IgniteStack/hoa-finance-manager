import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, Car
import { Textarea } from '@/components/ui/texta
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/t
import { toast } from 'sonner'

  memberId: string
}
export function MemberProfile({ memberId, onB
  const [members] = useKV<User[]>('system-users', [])
  const [documents, setDocuments] = useKV<MemberDocument[]>('member-documents', [])
  const [uploadForm, setUpload
    description: string

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
        </Button>
      toast.err
    

      const fileData = reader.result as string
        id: Date.now().toString(),
        fileName: uploadForm.file!.name,
        fileSize: uploadForm.file!.size,
        description: uploadForm.description,

      }
      setDoc
      setIsUploadDialogOpen(false)
        category: 'other',
        file: null,
    }
  }
  const handleDow
    link.hre
    l


  }
  const formatFileSize = (bytes: num
    if (bytes < 1024 

  const getCategoryIcon = (category: M
      case 'contract':
      case '
     

    }


        <Button variant="ghost" onCl
          Back
        <div>
            
     

      </div>
      <div className="grid 
          <CardHeader>
          </CardHeader>
            <div className="flex i
              <Ba
              </Badge>

              <span className="text-sm t
                {member.ownershipStatu
            </div>
            <div className="flex items
        uploadedAt: new Date().toISOString(),
        fileData,
      }

      setDocuments((current) => [...(current || []), newDocument])
      toast.success('Document uploaded successfully')
            <div className="pt-4 b
      setUploadForm({
              </div>
        description: '',
              <div 
      })
     
    reader.readAsDataURL(uploadForm.file)
   

  const handleDownload = (doc: MemberDocument) => {
    const link = document.createElement('a')
                <p>No paymen
            ) : (
                
   

                        <TableHead>Bank Acc
                      </TableRow>
                    <TableBody>
   

                          <TableCell>{payment.concept
                            {payment.bank
                          <TableCell className="text-right font-mono 
                          </TableCell>
   


                  {memb
                      
                          <div>
                     
                            </div>
                          <d
                          </div>
              
                            Account: {payment.bankAccount}
     
   

  return (
        </Card>

        <CardHeader>
            <div>
              
            {canM
             
              </Button>
          </div>
        <CardCo
            <div className="text-center py-12 text-mute
              <p>No documents uploaded yet</p>
              
              
      </div>

              <div className="hidden md:block rou
              
                      
                      <TableHead>Description</TableHe
                      <
                    </TableRow>
                  <TableBody>
                      <TableRow key={doc.id}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium"
                      
            </div>

                        <TableCell className="text-sm text-mute
                        </TableCell>
                          {formatFileSize(doc.fileSize)}
                        <TableCell>
                      
            </div>

                            </Button>
                              <Button variant="ghost" size="icon" onClick
                              </Button>
                          </d
                      
                  

              <div className="md:hid
                  <
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-1 min-w-0">
              </div>
              

                        </div>
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
        </CardC

        <Card className="md:col-span-2">
          <CardHeader>
              Add a new document for {member.first
            <CardDescription>Complete payment record for this member</CardDescription>
          <div classNam
          <CardContent>
                id="file-upload"
              <div className="text-center py-8 text-muted-foreground">
                <p>No payments recorded yet</p>
                Maxi
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
            <div className="space
                    </TableHeader>
                value={uploadFo
                      {memberPayments.map((payment) => (
              />
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
