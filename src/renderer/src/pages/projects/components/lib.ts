// MARK: Library
// -----------------------------------------------------------------------------
/**
 * Copies the contract number to the clipboard
 * @param project The project to read from
 */
export function clipContractNo(project: App.ProjectDoc) {
  navigator.clipboard.writeText(project.contractNo);
}

/**
 * Copies the drawing title to the clipboard
 * @param project The project to read from
 */
export function clipDrawingTitle(project: App.ProjectDoc) {
  navigator.clipboard.writeText(
    `${project.customerName} - ${project.contractNo} QTY: 0`.toUpperCase(),
  );
}

/**
 * Copies the email subject to the clipboard
 * @param project The project to read from
 */
export function clipEmailSubject(project: App.ProjectDoc) {
  navigator.clipboard.writeText(
    `${project.customerName} PO ${project.poNo} - HW ${project.contractNo}`,
  );
}
