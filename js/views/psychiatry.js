/* ============================================================
   views/psychiatry.js
   ============================================================ */
window.Views = window.Views || {};

Views.psychiatryFundamentals = function (root) {
  UI.renderStatusChecklist(root, {
    collection: 'psychiatryFundamentals',
    title: 'Psychiatry Fundamentals',
    subtitle: 'Psychiatric history, MSE, psychopathology, diagnosis, differential diagnosis and management.',
    statusOptions: Consts.SKILL_STATUS,
  });
};

Views.psychiatryDisorders = function (root) {
  UI.renderStatusChecklist(root, {
    collection: 'psychiatryDisorders',
    title: 'Major Disorders',
    subtitle: 'Track your study progress across the major psychiatric disorders.',
    statusOptions: Consts.SKILL_STATUS,
  });
};
