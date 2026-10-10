import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UploadCloud, Image, FileText, CheckCircle2, MapPin } from 'lucide-react';
import { CaseEvidence } from '../../types/case';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (evidence: CaseEvidence) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [docName, setDocName] = useState('');
  const [geoTag, setGeoTag] = useState('18.5314° N, 73.8446° E (Auto GPS)');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState<'IMAGE' | 'PDF'>('IMAGE');

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    setTimeout(() => {
      const newEv: CaseEvidence = {
        id: `ev-${Date.now()}`,
        name: docName || (selectedFileType === 'IMAGE' ? 'site_evidence_photo.jpg' : 'supporting_proof.pdf'),
        type: selectedFileType,
        url:
          selectedFileType === 'IMAGE'
            ? 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80'
            : '#',
        size: '2.1 MB',
        uploadedAt: new Date().toISOString(),
        verified: true,
        metadata: {
          geoTag,
          timestamp: new Date().toLocaleDateString(),
        },
      };

      onUpload(newEv);
      setIsUploading(false);
      onClose();
    }, 700);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Photo or Document Evidence"
      description="Attach photographic evidence, GPS geotags, or PDF documents to your grievance."
      size="md"
    >
      <form onSubmit={handleUploadSubmit} className="space-y-4">
        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
          <UploadCloud className="w-10 h-10 text-blue-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-800">
            Click to browse or drag and drop files
          </p>
          <p className="text-xs text-slate-400 mt-1">
            JPG, PNG, PDF or MP4 up to 25MB with auto GPS metadata extraction
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => setSelectedFileType('IMAGE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                selectedFileType === 'IMAGE'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              Photo / Video Proof
            </button>
            <button
              type="button"
              onClick={() => setSelectedFileType('PDF')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                selectedFileType === 'PDF'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              PDF Document
            </button>
          </div>
        </div>

        <Input
          label="File Name / Label"
          placeholder="e.g. road_pothole_site_view.jpg"
          value={docName}
          onChange={(e) => setDocName(e.target.value)}
        />

        <Input
          label="GPS Geotag Location (Auto-detected)"
          value={geoTag}
          onChange={(e) => setGeoTag(e.target.value)}
          leftIcon={<MapPin className="w-4 h-4 text-emerald-600" />}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isUploading}>
            Attach to Case
          </Button>
        </div>
      </form>
    </Modal>
  );
};
