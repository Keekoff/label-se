
import { useFetchJustificatifs } from "./hooks/useFetchJustificatifs";
import { useFileOperations } from "./hooks/useFileOperations";
import { groupJustificatifs } from "./hooks/utils";
import { UseJustificatifsReturn } from "./hooks/types";

export const useJustificatifs = (): UseJustificatifsReturn => {
  const {
    justificatifs,
    setJustificatifs,
    groupedJustificatifs,
    setGroupedJustificatifs,
    isLoading,
    submitError,
    submissionId,
    expandedGroups,
    toggleGroup
  } = useFetchJustificatifs();

  const { 
    uploading, 
    handleFileUpload, 
    handleFileDownload 
  } = useFileOperations({
    justificatifs,
    submissionId,
    setJustificatifs,
    groupJustificatifs,
    setGroupedJustificatifs
  });

  return {
    justificatifs,
    groupedJustificatifs,
    isLoading,
    submitError,
    submissionId,
    uploading,
    expandedGroups,
    toggleGroup,
    handleFileUpload,
    handleFileDownload
  };
};
