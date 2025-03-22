
import { Justificatif, GroupedJustificatifs, JustificatifStatus } from "../types";

export interface UseJustificatifsReturn {
  justificatifs: Justificatif[];
  groupedJustificatifs: GroupedJustificatifs;
  isLoading: boolean;
  submitError: string | null;
  submissionId: string | null;
  uploading: Record<string, boolean>;
  expandedGroups: Record<string, boolean>;
  toggleGroup: (questionId: string) => void;
  handleFileUpload: (justificatifId: string, file: File) => Promise<void>;
  handleFileDownload: (filePath: string, fileName: string, justificatifId: string) => Promise<void>;
}
