'use client'

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { FileJson, Trash2, Upload, CheckCircle } from "lucide-react"

interface FileCard {
  id: string
  name: string
  size: number
  lastModified: number
  status: 'pending' | 'uploading' | 'completed'
  progress: number
}

export function FileUploadCardsComponent() {
  const [files, setFiles] = useState<FileCard[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
        .filter(file => file.name.endsWith('.json'))
        .map(file => ({
          id: `${file.name}-${file.size}-${file.lastModified}`,
          name: file.name,
          size: file.size,
          lastModified: file.lastModified,
          status: 'pending' as const,
          progress: 0
        }))
      setFiles(prevFiles => [...prevFiles, ...newFiles])
    }
  }

  const removeFile = (id: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    else return (bytes / 1048576).toFixed(1) + ' MB'
  }

  const formatLastModified = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const uploadFiles = () => {
    setFiles(prevFiles =>
      prevFiles.map(file => 
        file.status === 'pending' ? { ...file, status: 'uploading' } : file
      )
    )

    files.forEach(file => {
      if (file.status === 'pending') {
        simulateFileUpload(file.id)
      }
    })
  }

  const simulateFileUpload = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setFiles(prevFiles =>
        prevFiles.map(file =>
          file.id === fileId
            ? { ...file, progress, status: progress === 100 ? 'completed' : 'uploading' }
            : file
        )
      )
      if (progress === 100) {
        clearInterval(interval)
      }
    }, 500)
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload VCon Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Select JSON files</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".json"
                    onChange={handleFileChange}
                  />
                </div>
                <Button className="w-full" onClick={uploadFiles}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              </div>
            </CardContent>
          </Card>
          <div className="text-sm text-muted-foreground">
            <p>Supported file type: JSON</p>
            <p>Maximum file size: 10MB</p>
          </div>
        </div>

        <div className="lg:w-2/3">
          <h2 className="text-2xl font-bold mb-4">Uploaded Files</h2>
          {files.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No files uploaded yet. Upload some JSON files to get started.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {files.map(file => (
                <Card key={file.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileJson className="h-5 w-5 text-primary" />
                      <span className="truncate">{file.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">
                      Size: {formatFileSize(file.size)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Last modified: {formatLastModified(file.lastModified)}
                    </p>
                    {file.status === 'uploading' && (
                      <div className="mt-2">
                        <Progress value={file.progress} className="w-full" />
                        <p className="text-sm text-muted-foreground mt-1">
                          Uploading: {file.progress}%
                        </p>
                      </div>
                    )}
                    {file.status === 'completed' && (
                      <div className="mt-2 flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        <span className="text-sm">Upload complete</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full"
                      onClick={() => removeFile(file.id)}
                      disabled={file.status === 'uploading'}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}