/*
==========================================
EXPORT BUTTON

Purpose:
Download inventory data as CSV.

API:
GET /export
==========================================
*/

function ExportButton() {

  const handleExport = () => {
    window.open(
      "http://127.0.0.1:5000/export",
      "_blank"
    );
  };

  return (
    <button onClick={handleExport}>
      Export CSV
    </button>
  );
}

export default ExportButton;