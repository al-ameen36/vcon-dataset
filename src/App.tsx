import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileJson, Trash2, Upload, CheckCircle, Download } from "lucide-react";
import Spinner from "./components/loader/loader";
import {
  useDownloadFileMutation,
  useUploadFilesMutation,
} from "./store/app.api";

interface FileCard {
  id: string;
  name: string;
  size: number;
  lastModified: number;
  status: "pending" | "uploading" | "completed";
  progress: number;
  file: File;
}

export default function FileUploadCards() {
  const [files, setFiles] = useState<FileCard[]>([]);
  const [uploadFilesMutation] = useUploadFilesMutation();
  const [downloadFile] = useDownloadFileMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
        .filter((file) => file.name.endsWith(".json"))
        .map((file) => ({
          id: `${file.name}-${file.size}-${file.lastModified}`,
          name: file.name,
          size: file.size,
          lastModified: file.lastModified,
          status: "pending" as const,
          progress: 0,
          file: file,
        }));
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const formatLastModified = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  const uploadFiles = async () => {
    const formData = new FormData();

    files.forEach((fileCard) => {
      formData.append("files", fileCard.file);
    });

    try {
      const response = await uploadFilesMutation(formData);
      console.log("Upload successful:", response);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };
  const handleDownload = async (filename: string) => {
    try {
      const response = await downloadFile(filename).unwrap();

      // Convert response to JSON string if it's an object
      const jsonString = JSON.stringify(response, null, 2);

      // Create a Blob from the JSON string
      const blob = new Blob([jsonString], { type: "application/json" });

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.json`; // Set the desired filename for the download
      document.body.appendChild(link);
      link.click();

      // Clean up and remove the link after the download
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-teal-50">
      <div className="w-full max-w-7xl mx-auto p-4 pt-10 h-screen">
        <div className="flex flex-col lg:flex-row gap-8 h-full">
          <div className="lg:w-1/3 space-y-6 bg-white h-full p-10 shadow rounded-sm">
            <Card className="shadow-none border-transparent">
              <CardHeader className="px-0 mb-5">
                <CardTitle>Upload VCon Files</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
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
            <h2 className="text-2xl font-bold mb-4">
              Create AI training data form VCon
            </h2>
            {files.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No files uploaded yet. Upload some JSON files to get started.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {files.map((file) => (
                  <Card key={file.id} className="flex flex-col rounded-sm">
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
                      {file.status === "completed" && (
                        <div className="mt-2 flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          <span className="text-sm">Upload complete</span>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex gap-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        onClick={() => removeFile(file.id)}
                        disabled={file.status === "uploading"}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                      <Button
                        className="w-full"
                        onClick={() => handleDownload(file.name)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Dataset
                      </Button>
                      {file.status == "uploading" ? <Spinner /> : null}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
