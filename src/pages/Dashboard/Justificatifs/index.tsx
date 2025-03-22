
import { useJustificatifs } from "./useJustificatifs";
import JustificatifGroup from "./JustificatifGroup";
import EmptyState from "./EmptyState";

const Justificatifs = () => {
  const {
    justificatifs,
    groupedJustificatifs,
    isLoading,
    submitError,
    uploading,
    expandedGroups,
    toggleGroup,
    handleFileUpload,
    handleFileDownload
  } = useJustificatifs();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Chargement des justificatifs...</p>
      </div>
    );
  }

  if (justificatifs.length === 0) {
    return <EmptyState error={submitError} />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold">Pièces justificatives</h1>
        <p className="text-gray-500 mt-2">
          Veuillez télécharger les documents demandés ci-dessous pour compléter votre dossier
        </p>
      </div>

      <div className="space-y-6">
        {Object.values(groupedJustificatifs).map(group => (
          <JustificatifGroup
            key={group.questionId}
            group={group}
            expanded={expandedGroups[group.questionId]}
            uploading={uploading}
            onToggle={toggleGroup}
            onUpload={handleFileUpload}
            onDownload={handleFileDownload}
          />
        ))}
      </div>
    </div>
  );
};

export default Justificatifs;
