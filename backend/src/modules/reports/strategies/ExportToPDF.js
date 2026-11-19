const PDFDocument = require('pdfkit');
const ExportStrategy = require('./ExportStrategy');

class ExportToPDF extends ExportStrategy {
  getContentType() {
    return 'application/pdf';
  }

  getFileExtension() {
    return 'pdf';
  }

  formatDate(value) {
    if (!value) return '-';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString('id-ID');
  }

  export(tasks) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 40, size: 'A4' });
        const chunks = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (err) => reject(err));

        doc
          .fontSize(16)
          .font('Helvetica-Bold')
          .text('LAPORAN REKAPITULASI TUGAS (TASK MANAGER)', { align: 'center' });
        doc.moveDown(0.3);
        doc
          .fontSize(10)
          .font('Helvetica')
          .text(
            `Tanggal Cetak: ${new Date().toLocaleString('id-ID')} | Total Tugas: ${(tasks || []).length}`,
            { align: 'center' }
          );
        doc.moveDown(1);
        doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
        doc.moveDown(1);

        if (!tasks || tasks.length === 0) {
          doc.fontSize(11).font('Helvetica-Oblique').text('Tidak ada data tugas untuk diekspor.');
        } else {
          tasks.forEach((task, index) => {
            const statusLabel = task.column?.name ?? task.status ?? task.columnId ?? '-';
            const assigneeLabel = task.assignee?.name ?? task.assigneeName ?? task.assignee ?? '-';

            doc
              .fontSize(11)
              .font('Helvetica-Bold')
              .text(`${index + 1}. ${task.title || 'Tanpa Judul'}`);

            doc
              .fontSize(9.5)
              .font('Helvetica')
              .text(
                `   Prioritas: ${task.priority ?? '-'}  |  Status: ${statusLabel}  |  Assignee: ${assigneeLabel}  |  Deadline: ${this.formatDate(task.deadline)}`
              );

            if (task.description) {
              doc.text(`   Deskripsi: ${task.description}`);
            }

            doc.moveDown(0.7);
          });
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = ExportToPDF;