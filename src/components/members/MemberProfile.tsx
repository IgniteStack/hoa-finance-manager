import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { useAuth } from '@/contexts/AuthContext'
import { User, Payment, MemberDocument } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Upload, Download, Trash, File, FileText, Image as ImageIcon, IdentificationCard, Receipt } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { format } from 'date-fns'

  onBack: () => void

  const { user: curr
 

    category: MemberDocument['category']
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
  const memberPayments = payments?.filter(p => p.neighborId === memberId && p.status === 'active') || []
  const memberDocuments = documents?.filter(d => d.memberId === memberId) || []
  
  const totalPaid = memberPayments.reduce((sum, p) => sum + p.amount, 0)
  
  const canManageDocuments = isAdmin || currentUser?.id === memberId

  if (!member) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Member not found</p>
        <Button variant="outline" onClick={onBack} className="mt-4">
          <ArrowLeft className="mr-2" size={18} />
          Back to Members
        </Button>
      </div>
    )
   

  const handleUpload = () => {
    if (!uploadForm.file) {
      toast.error('Please select a file')
      return
    r

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
        uploadedBy: currentUser?.email || 'Unknown',
    <div className="space-y-6">
        <Button v
       

            {member.firstName} {member.lastName}
          <p className="text-muted-foreground">House 
      setIsUploadDialogOpen(false)
      <div className=
        category: 'other',
          </CardHeader>
        file: null,
        
    }
              </Badge>
  }

                <span className="font-medium">{memb
              {member.phoneNumber && (
    link.href = doc.fileData
    link.download = doc.fileName
    link.click()
  }

  const handleDelete = (docId: string) => {
    setDocuments((current) => (current || []).filter(d => d.id !== docId))
    toast.success('Document deleted')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getCategoryIcon = (category: MemberDocument['category']) => {
    switch (category) {
      case 'contract':
        return <FileText size={18} className="text-primary" />
      case 'receipt':
        return <Receipt size={18} className="text-accent" />
      case 'identification':
        return <IdentificationCard size={18} className="text-muted-foreground" />
      default:
        return <File size={18} className="text-muted-foreground" />
    }
  }

          
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
          <p className="text-muted-foreground">House #{member.houseNumber}</p>
        </div>
            

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Member Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                {member.role}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {member.ownershipStatus}
              </Badge>
        <CardConte
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{member.email}</span>
                  <T
              {member.phoneNumber && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{member.phoneNumber}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={member.isActive ? 'default' : 'secondary'}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>

            <div className="pt-4 border-t">
                        <TableCell>
                          <div className="text-xs text-muted-foreground">{doc.uploadedBy}</div>
                        <TableCell className
                    
            </div>

                              </Bu
                          </div>
                      </TableRow>
                  </TableBody>
              </div>
              <div
                  <Card 
        </Card>

                          <Badge variant
                      
            <CardTitle>Payment History</CardTitle>
                        </div>
          </CardHeader>
                       
            {memberPayments.length === 0 ? (
                        <span>{format(new Date(doc.uploadedAt), 'MMM d
                      </div>
              </div>
                 
                        {canManageDocumen
                            <Trash size={16} />
                        )
                    </CardContent
                ))}
            </div>
        </CardContent>

        <DialogContent>
                      </TableRow>
              Add a new document f
                    <TableBody>
            <div className="space-y-2">
                        <TableRow key={payment.id}>
                onValueChange={(value) => setUploadForm({ ...upload
                <SelectTrigger id="category">
                </SelectTrigger>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="identification">Identification
                </SelectContent>
            </div>
            <div className="space-y-2">
              <Textarea
                value={uploadForm.desc
                placeholder="Brief 
                      ))}
            <div className="spac
                  </Table>
                type="

              <p className="text-xs text-muted-foregr
                  {memberPayments.map((payment) => (

              <Button variant="outline" onClick={()
              </Button>
                <Upload classNa
              </Button>
          </div>
      </Dialog>
  )









                        )}



                </div>

            )}

        </Card>


      <Card>






            {canManageDocuments && (



              </Button>

          </div>

        <CardContent>



              <p>No documents uploaded yet</p>





              )}

          ) : (









                      <TableHead>Uploaded</TableHead>

                    </TableRow>

                  <TableBody>







                        </TableCell>

                          <Badge variant="outline" className="capitalize">


                        </TableCell>




                          {formatFileSize(doc.fileSize)}

                        <TableCell>











                              </Button>

                          </div>





              </div>



                  <Card key={doc.id}>

                      <div className="flex items-start gap-3 mb-3">

                        <div className="flex-1 min-w-0">











                          {doc.description}

                      )}

                        <span>{format(new Date(doc.uploadedAt), 'MMM dd, yyyy')}</span>
                        <span>{doc.uploadedBy}</span>








                            <Trash size={16} />

                        )}

                    </CardContent>

                ))}

            </div>

        </CardContent>









          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={uploadForm.category}
                onValueChange={(value) => setUploadForm({ ...uploadForm, category: value as MemberDocument['category'] })}
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


            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                placeholder="Brief description of this document..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-upload">File</Label>
              <Input
                id="file-upload"
                type="file"
                onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
              />
              <p className="text-xs text-muted-foreground">
                Maximum file size: 10MB. Accepted formats: PDF, DOC, DOCX, JPG, PNG, GIF
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={!uploadForm.file}>
                <Upload className="mr-2" size={18} />
                Upload
              </Button>
            </div>
          </div>

      </Dialog>

  )

