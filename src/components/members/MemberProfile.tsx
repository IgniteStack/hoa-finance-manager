import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { User, Payment, MemberDocument } from '@/lib/types'
import { useAuth } from '@/contexts/AuthContext'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeft, Upload, Download, Trash, File, FileText, Image as ImageIcon, IdentificationCard, Receipt } from '@phosphor-icons/react'

import { format } from 'date-fns'

interface MemberProfileProps {
  
  onBack: () => void
 

  const [uploadForm, setUploadForm] = useState<{
  const { user: currentUser, isAdmin } = useAuth()
  const [members] = useKV<User[]>('system-users', [])
  const [payments] = useKV<Payment[]>('payments', [])
    description: '',
  
  const member = members?.find(m => m.id === memberId)
  const memberPayments = payments?.filter(p => p.neighborId === memberId && p.status === 'active') || []
  const memberDocuments = documents?.filter(d => d.memberId === memberId) || []

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState<{
      const newDocument: MemberDocument 
        memberId,
        fileType: upl
      
        uploadedBy: cu
        fileData,

    

        descript
      })
    reader.readAsDataURL(uploadFo

    const link = document.createE
    link.downl
  }
  const handle
    toast.success('Document deleted')

    switch (category) {
        </Card>
        retu
     
   

  const formatFileSize = (bytes: n
    if (bytes < 1024 * 1024
  }
  return (
     

        </Button>

        <Card>
            <CardTitle>Member Information</
          </CardHeader>
            <div 
                <Label className="text-m
              </div>
                <Label className="text-m
              </div>
                <Label className="text-muted
              </div>
                <Label className="text-muted-
              </d
       

                  </Badge>
              </div>
                <Label className="
                  <Ba
                  </Badge>
              </div>
                <La
        
     
                  ${member.balance.toFixe
   


          <CardHeader>
            <CardDescription
          <CardContent>
              <d
   

                  <Label className="text-mu
                    ${memberPayments.reduce((sum, p) => sum + p.amount, 0)
                </div>
   


        <CardHeader>
            <div>
              <CardDescription>All recorded payments for this 
          </div>
        <CardContent>
            <div className="
            </div>
            <d
                <TableHeader>
     
   

                <TableBody>
                    .sort((a, b) => new D
                      <TableRow key={payment.id}>
                        <TableCell className="font-me
   

          
          )}
      </Card>
      <Card>
          <div className="flex it
              
            </div
            

            )}
        </Card
          {memberDocum
              No documents uploaded yet
          ) : (
              {memberDo
                .map((doc) => (
                    key={doc.id}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm text-muted-fo
                    
                   
                      </div>
                        <p className="text-sm text-muted-foreground 
                    
                   
                        size="icon"
                        title="Download"
                    
                   
                          variant="ghost"
                          onClick={() => handleDelete(doc.id)}
                    
                   
                    </div>
                ))}
          )}
      </Card>
      <Dialog open={isUplo
          <DialogHeade
            <DialogD
            </Dialo
          <div className="space-y-4">
              <Label 
                value={uploadForm.category}
              >
                  <SelectV
                <Selec
                  <S
                  <
              </Select>
            <div className="space-y-2">
              <Texta
                val
                placeholder="Add a description for this document"
              />
            <div className="space-y-2">
              <Input
                type
                ac
              <p classNa
              <

            <B
            </Button>
              Upload
          </DialogFooter>
      </Dialog>
  )


















      <Card>





















































              </Button>

          </div>

        <CardContent>




          ) : (












































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


              />
            </div>
            <div className="space-y-2">

              <Input

                type="file"
                onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}

              />
              <p className="text-xs text-muted-foreground">

              </p>
            </div>
          </div>









      </Dialog>

  )

