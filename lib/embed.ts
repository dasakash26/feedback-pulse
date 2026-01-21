export function generateEmbedScript(apiKey: string, baseUrl: string): string {
  return `<script
  src="${baseUrl}/widget.js"
  data-project-key="${apiKey}"
></script>`;
}
