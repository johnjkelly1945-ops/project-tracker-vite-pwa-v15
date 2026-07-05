// @ts-nocheck

export function navigateToGovernanceSource({
  event,
  setActiveRiskEventId,
  setRiskModalOpen,
  setActiveIssueEventId,
  setIssueModalOpen,
  setActiveQcEventId,
  setQcModalOpen,
  setActiveCcEventId,
  setCcModalOpen
}) {
  if (!event) return;

  switch (event.sourceType) {
    case "RISK":
      setActiveRiskEventId(event.sourceId);
      setRiskModalOpen(true);
      break;

    case "ISSUE":
      setActiveIssueEventId(event.sourceId);
      setIssueModalOpen(true);
      break;

    case "QC":
      setActiveQcEventId(event.sourceId);
      setQcModalOpen(true);
      break;

    case "CC":
      setActiveCcEventId(event.sourceId);
      setCcModalOpen(true);
      break;

    default:
      return;
  }
}

export default navigateToGovernanceSource;
