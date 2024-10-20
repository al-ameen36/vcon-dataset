'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, FileJson, Download, CheckCircle, AlertCircle } from "lucide-react"

export function VconUploadReview() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isReviewComplete, setIsReviewComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file => file.name.endsWith('.json'))
      setFiles(prevFiles => [...prevFiles, ...newFiles])
      setError(null)
    }
  }

  const removeFile = (fileName: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName))
  }

  const processFiles = async () => {
    setIsProcessing(true)
    setProgress(0)
    setError(null)

    for (let i = 0; i < files.length; i++) {
      await new Promise<void>(resolve => {
        setTimeout(() => {
          setProgress(((i + 1) / files.length) * 100)
          resolve()
        }, 1000) // Simulate processing time
      })
    }

    setIsProcessing(false)
    setIsReviewComplete(true)
  }

  const downloadResults = () => {
    // In a real application, you would generate this data from the AI review results
    const mockTrainingData = JSON.stringify({
      reviewed_vcons: files.map(file => file.name),
      model_improvements: "Sample improvements based on VCon review",
      timestamp: new Date().toISOString()
    }, null, 2)

    const blob = new Blob([mockTrainingData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ai_review_results.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div>
        <Label htmlFor="vcon-files">Upload VCon Files (JSON format)</Label>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="vcon-files"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-primary hover:text-primary/80"
              >
                <span>Upload files</span>
                <Input
                  id="vcon-files"
                  name="vcon-files"
                  type="file"
                  multiple
                  accept=".json"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">JSON files only</p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Selected Files:</h4>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-secondary p-2 rounded-md">
                <div className="flex items-center">
                  <FileJson className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(file.name)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  aria-label={`Remove ${file.name}`}
                >
                  <AlertCircle className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="text-destructive text-sm">{error}</div>
      )}

      <Button 
        onClick={processFiles} 
        disabled={files.length === 0 || isProcessing}
        className="w-full"
      >
        {isProcessing ? 'Processing...' : 'Start AI Review'}
      </Button>

      {isProcessing && (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Processing files...</div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {isReviewComplete && (
        <div className="space-y-4">
          <div className="flex items-center text-sm text-green-600">
            <CheckCircle className="h-4 w-4 mr-2" />
            AI review complete
          </div>
          <Button onClick={downloadResults} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download Results
          </Button>
        </div>
      )}
    </div>
  )
}