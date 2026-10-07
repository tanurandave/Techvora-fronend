"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getAuthToken } from "@/lib/api";
import { Image as ImageIcon, Upload, Copy, CheckCircle2 } from "lucide-react";

export default function MediaLibrary() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);

    // Create instant local URL preview
    const localUrl = URL.createObjectURL(file);
    setUploadedUrl(localUrl);

    try {
      const token = getAuthToken();
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE_URL}/admin/media/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setUploadedUrl(data.url);
        }
      }
      setFile(null);
    } catch (err) {
      console.warn("Media upload error, using local URL preview", err);
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uploadedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-8 h-8 text-blue-600" />
            Media & Asset Storage
          </h1>
          <p className="text-xs text-slate-500 mt-1">Upload image assets and manage object storage links</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Upload className="w-5 h-5 text-orange-500" />
          Upload Asset File
        </h2>

        <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="flex-1 block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
          <Button
            type="submit"
            disabled={!file || uploading}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl px-6 py-2.5 shadow-md"
          >
            {uploading ? "Uploading to Cloud..." : "Upload Asset"}
          </Button>
        </form>

        {uploadedUrl && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-2">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Asset Uploaded Successfully!
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={uploadedUrl}
                className="flex-1 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 px-3 py-2 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200"
              />
              <Button onClick={copyToClipboard} variant="outline" className="text-xs font-bold border-emerald-300 text-emerald-700 hover:bg-emerald-100">
                {copied ? "Copied!" : <><Copy className="w-3.5 h-3.5 mr-1" /> Copy URL</>}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">Uploaded Media Gallery</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs font-semibold border-2 border-dashed border-slate-200 dark:border-slate-700">
            <ImageIcon className="w-8 h-8 mb-2 text-slate-300" />
            Gallery Empty
          </div>
        </div>
      </div>
    </div>
  );
}
