import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHe
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/s
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Upload, Download, Trash, File, FileText, Image as ImageIcon, IdentificationCard, Receipt } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface MemberProfileProps {
  const [isUploadD
  onBack: () => void
 

    category: 'other',
  const { user: currentUser, isAdmin } = useAuth()
  const [members] = useKV<User[]>('system-users', [])
  const [payments] = useKV<Payment[]>('payments', [])
  const memberPayments = payments?.filter(p => p.neighborId === memberId && p.statu
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState<{
    category: MemberDocument['category']

    file: File | null
  }>({
    category: 'other',

    reader.onlo
    

        fileType: uploadForm.file!.type,
        category: uploadForm.category,
        uploadedBy: currentUser?.email || 'Unknown',
  

  
      setUploadForm({

      })
    reader.r

    const link = document.createElement('a')
    link.download = doc.fileName
  }
  const handleDelete = (d
    toast.success

    i
   

    switch (category) {
        return <FileText si
        return <Receipt size={18} classNa
        retu
     

  return (
      <div className="flex items-center gap
          <A
     

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
        uploadedAt: Date.now(),
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
        </CardHeader>
     
   

          
                  <TableRow>
                    <TableHead>Category</TableH
                    <TableHead>Uploaded</TableHea
                  </TableRow>
              
                 
             
                          <div>
                            {doc.description && 
               
                        </div>
              
            

                        {formatFileSize(doc.fileS
              
                      
                        </div>
                      <
                          <Button 
                            size="icon" 
                          >
                          </B
                      
                              size="icon" 
                            >
                      
                  
            
                </TableBody>
            </div>
        </CardContent>

        <DialogConte
            <DialogTitle>Upload Docume
              Add a new document for {member.firstName} {member.las
          </DialogHeader>
            <div className="space-y-2">
                </div>
                
                <SelectTrigger id="category">
                </SelectTrigger>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="identification">Identi
                </Select
            </div>
            <div c

                value={uploadForm.descripti
                placeholder="Brief description of this document..
            </div>
            <div className="space-y-2">
              <Input
                type="f
                acce
              <p c
              </p>


              </Button>
                <Uploa
              </Button>
          </div>
      </Dialog>
  )

































            )}

        </Card>


      <Card>








            {canManageDocuments && (



              </Button>

          </div>

        <CardContent>


              <p>No documents uploaded yet</p>

          ) : (






















                          </div>








































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

