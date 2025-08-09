const app=require('../express.js')
const groundGames=require('../all_schemas/ground-game.schma.js')
const { dbconnect } = require('../dbconnection.js')
dbconnect()
const path = require('path');

const { productedPdf }=require('../utils/product-pdf.js')
// const hummus = require('hummus-recipe');

const multer = require('multer');
const fs = require('fs');
const { exec } = require('child_process')

const fsPromise=require('fs/promises')
const AdmZip = require('adm-zip');
const { Zip } = require('zip-lib');
app.get('/download-excel-zip', async (req, res) => {
  // 1. Create Workbook & Sheet
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('CredoPay Report');

  // 2. Add Styled Heading Row
  const headingRow = sheet.addRow(['CredoPay Report Summary']);
  headingRow.font = { bold: true, size: 16 };
  sheet.mergeCells(`A${headingRow.number}:E${headingRow.number}`);
  sheet.addRow([]);

  // 3. Add dummy data (can be dynamic)
  sheet.addRow(['MID', 'CRED00123']);
  sheet.addRow(['Amount', '₹10,000']);
  sheet.addRow(['Status', 'Success']);

  // 4. Set filenames
  const excelFile = 'CredoPay_Report.xlsx';
  const zipFile = 'CredoPay_Report.zip';
  const password = '123';

  try {
    // 5. Save Excel to disk
    await workbook.xlsx.writeFile(excelFile);

    // 6. Run 7-Zip to create password-protected ZIP
    const cmd = `7z a -p${password} -tzip ${zipFile} ${excelFile}`;
    exec(cmd, async (err, stdout, stderr) => {
      if (err) {
        console.error(' Error zipping file:', err.message);
        return res.status(500).send('Failed to zip the Excel file');
      }

      // 7. Send ZIP as download
      res.setHeader('Content-Disposition', `attachment; filename=${zipFile}`);
      res.setHeader('Content-Type', 'application/zip');
      res.sendFile(path.resolve(zipFile), async () => {
        // 8. Cleanup files
        await fs.unlink(excelFile);
        await fs.unlink(zipFile);
      });
    });
  } catch (err) {
    console.error(' Unexpected Error:', err.message);
    res.status(500).send('Internal server error');
  }
});

app.post('/createGroundGames',async(req,res)=>{
    console.log("req.body",req.body)
    let create=await groundGames.create(req.body)
    res.send(create)
})

app.get('/getByIdground/:id',async(req,res)=>{
    let getOne=await groundGames.findById(req.params.id)
    res.send(getOne)
})

app.get('/getAllGroundGames',async(req,res)=>{
    let queryData={}
    if(req.query.name){
        queryData={
            ...queryData,
            name:req.query.name
        }
    }
    if(req.query.players){
        queryData={
            ...queryData,
            players:req.query.players
        }
    }
    let count=await groundGames.countDocuments(queryData)
    console.log("COUNT--->",count)
    let getAll=await groundGames.find(queryData)
    res.send(getAll)
})



const upload = multer(); // store uploaded files here
// // upload.single('file')



// const upload = multer({ dest: 'uploads/' }); // store uploaded files here


app.get('/testprotect-pdf',async(req,res)=>{
   const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  // page.drawText('This is a password-protected PDF!', { x: 50, y: 150 });
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
const fontSize = 24;

// Get page size
const { width, height } = page.getSize();

// Calculate centered title position
const text = 'My PDF Title';
const textWidth = font.widthOfTextAtSize(text, fontSize);
const x = (width - textWidth) / 2;
const y = height - fontSize - 20; // top margin (20 points from top)

page.drawText(text, {
  x,
  y,
  size: fontSize,
  font,
  color: rgb(0.2, 0.2, 0.7),
});

const startX = 50;
const startY = height - 100;
const colWidths = [150, 150, 150];
const rowHeight = 30;

const data = [
  ['Name', 'Role', 'Location'],
  ['Alice', 'Engineer', 'Delhi'],
  ['Bob', 'Manager', 'Chennai'],
];

// Draw table
for (let row = 0; row < data.length; row++) {
  for (let col = 0; col < data[row].length; col++) {
    const cellX = startX + colWidths.slice(0, col).reduce((a, b) => a + b, 0);
    const cellY = startY - row * rowHeight;
    
    // Draw text
    page.drawText(data[row][col], {
      x: cellX + 5,
      y: cellY - rowHeight + 10,
      size: 12, //fontSize
      font,
      color: rgb(0, 0, 0),
    });

    // Draw cell border (top, bottom, left, right)
    page.drawLine({ start: { x: cellX, y: cellY }, end: { x: cellX + colWidths[col], y: cellY } }); // top
    page.drawLine({ start: { x: cellX, y: cellY - rowHeight }, end: { x: cellX + colWidths[col], y: cellY - rowHeight } }); // bottom
    page.drawLine({ start: { x: cellX, y: cellY }, end: { x: cellX, y: cellY - rowHeight } }); // left
    page.drawLine({ start: { x: cellX + colWidths[col], y: cellY }, end: { x: cellX + colWidths[col], y: cellY - rowHeight } }); // right
  }
}


  await pdfDoc.encrypt({
    userPassword: "123456",
    ownerPassword: "123456",
    permissions: { printing: false, modifying: false },
  });

  let protectedPdf=  Buffer.from(await pdfDoc.save());
  res.setHeader('Content-Disposition', `attachment; filename="protected-${Date.now()}.pdf"`);
  res.setHeader('Content-Type', 'application/pdf');
  res.send(protectedPdf);
})

app.post('/protect-excel', upload.single('file'), async (req, res) => {
  try{
  const password = req.body.password;
  const filename = `excel-${Date.now()}.xlsx`;
  const zipname = `protected-${Date.now()}.zip`;

  // Save uploaded Excel file temporarily
  await fsPromise.writeFile(filename, req.file.buffer);

  // Create a password-protected zip
  const zip = new AdmZip();
  zip.addLocalFile(filename);
  zip.setPassword(password);
  zip.writeZip(zipname);

  // Send the zipped Excel file
  res.setHeader('Content-Disposition', `attachment; filename="${zipname}"`);
  res.setHeader('Content-Type', 'application/zip');
  res.sendFile(path.resolve(zipname), () => {
    fsPromise.unlink(filename); // cleanup
    fsPromise.unlink(zipname);  // cleanup
  });
}catch(err){
 console.log("err-->",err)
}
});


const XLSX = require('xlsx');
const data = require('./data');
app.get('/protect-excelsheet', async (req, res) => {
      const workbook = XLSX.utils.book_new();

// --- Merchant Info ---
const merchantData = [
  ["Merchant Name", data.merchantInfo.name, "", "", "From Date", data.merchantInfo.fromDate],
  ["MID", data.merchantInfo.mid, "", "", "To Date", data.merchantInfo.toDate],
  ["CFD", data.merchantInfo.cfd, "", "", "Generated On", data.merchantInfo.generatedOn],
  ["GSTIN", data.merchantInfo.gstin, "", "", "Support Contact", data.merchantInfo.supportContact],
  ["PAN", data.merchantInfo.pan, "", "", "Support Mail", data.merchantInfo.supportMail],
  ["Address", data.merchantInfo.address, "", "", "Website", data.merchantInfo.website]
];
const merchantSheet = XLSX.utils.aoa_to_sheet(merchantData);
XLSX.utils.book_append_sheet(workbook, merchantSheet, "Merchant Info");

// --- Settlement Summary ---
const settlementHeader = ["Transaction Date", "Gross", "Fee", "GST", "Net Payable", "Refund", "Chargeback", "Net Settlement"];
const settlementRows = data.settlementSummary.map(entry => [
  entry.transactionDate,
  `₹${entry.gross}`,
  `₹${entry.fee}`,
  `₹${entry.gst}`,
  `₹${entry.netPayable}`,
  `₹${entry.refund}`,
  `₹${entry.chargeback}`,
  `₹${entry.netSettlement}`
]);
const settlementSheet = XLSX.utils.aoa_to_sheet([settlementHeader, ...settlementRows]);
XLSX.utils.book_append_sheet(workbook, settlementSheet, "Settlement Summary");

// --- POS Summary ---
const posHeader = ["Bank", "Txn Count", "VISA", "MasterCard", "RUPAY", "Total Amount", "Net"];
const posRows = data.posSummary.map(e => [
  e.bank,
  e.txnCount,
  e.visa,
  e.master,
  e.rupay,
  `₹${e.amount}`,
  `₹${e.net}`
]);
const posSheet = XLSX.utils.aoa_to_sheet([posHeader, ...posRows]);
XLSX.utils.book_append_sheet(workbook, posSheet, "POS Summary");

// --- Additional Fees ---
const feeHeader = ["Txn ID", "Txn Date", "Fee Type", "Debit", "Credit"];
const feeRows = data.additionalFees.map(fee => [
  fee.txnId,
  fee.date,
  fee.feeType,
  `₹${fee.debit}`,
  `₹${fee.credit}`
]);
const feeSheet = XLSX.utils.aoa_to_sheet([feeHeader, ...feeRows]);
XLSX.utils.book_append_sheet(workbook, feeSheet, "Additional Fees");

// --- Save Excel File ---
XLSX.writeFile(workbook, "CredoPay_Report.xlsx");

console.log("✅ Dynamic Excel generated: CredoPay_Report.xlsx");
})


app.get('/protect-excelsheet1', async (req, res) => {

try{
const worksheetData = [];

// Add Merchant Info
worksheetData.push(["Merchant Name", data.merchantInfo.name, "", "", "From Date", data.merchantInfo.fromDate]);
worksheetData.push(["MID", data.merchantInfo.mid, "", "", "To Date", data.merchantInfo.toDate]);
worksheetData.push(["CFD", data.merchantInfo.cfd, "", "", "Generated On", data.merchantInfo.generatedOn]);
worksheetData.push(["GSTIN", data.merchantInfo.gstin, "", "", "Support Contact", data.merchantInfo.supportContact]);
worksheetData.push(["PAN", data.merchantInfo.pan, "", "", "Support Mail", data.merchantInfo.supportMail]);
worksheetData.push(["Address", data.merchantInfo.address, "", "", "Website", data.merchantInfo.website]);

worksheetData.push([]); // blank row for spacing

// Settlement Summary
worksheetData.push(["Settlement Summary"]);
worksheetData.push(["Transaction Date", "Gross", "Fee", "GST", "Net Payable", "Refund", "Chargeback", "Net Settlement"]);
data.settlementSummary.forEach(e => {
  worksheetData.push([
    e.transactionDate,
    `₹${e.gross}`,
    `₹${e.fee}`,
    `₹${e.gst}`,
    `₹${e.netPayable}`,
    `₹${e.refund}`,
    `₹${e.chargeback}`,
    `₹${e.netSettlement}`
  ]);
});

worksheetData.push([]); // blank row

// POS Summary
worksheetData.push(["POS Settlement Summary"]);
worksheetData.push(["Bank", "Txn Count", "VISA", "MasterCard", "RUPAY", "Total Amount", "Net"]);
data.posSummary.forEach(e => {
  worksheetData.push([
    e.bank,
    e.txnCount,
    e.visa,
    e.master,
    e.rupay,
    `₹${e.amount}`,
    `₹${e.net}`
  ]);
});

worksheetData.push([]); // blank row

// Additional Fees
worksheetData.push(["Additional Fees"]);
worksheetData.push(["Txn ID", "Txn Date", "Fee Type", "Debit", "Credit"]);
data.additionalFees.forEach(f => {
  worksheetData.push([
    f.txnId,
    f.date,
    f.feeType,
    `₹${f.debit}`,
    `₹${f.credit}`
  ]);
});

// Generate Sheet
const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "CredoPay Report");

// Save Excel
XLSX.writeFile(workbook, "CredoPay_Report_SingleSheet.xlsx");

console.log("✅ Excel generated with all sections in one sheet.");
}catch(err){
  console.log("err==>",err)
}
})


const ExcelJS = require('exceljs');

const workbook = new ExcelJS.Workbook();
const sheet = workbook.addWorksheet('CredoPay Report');

// const { exec } = require('child_process');
// const path = require('path');


app.get('/protect-excelsheet-pass', async (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Report');

  sheet.addRow(['MID', 'CRED00192']);
  sheet.addRow(['Amount', 10000]);

  const excelFile = 'CredoPay_Report_Styled.xlsx';
  const zipFile = 'CredoPay_Report_Protected.zip';
  const password = '123';

if (fs.existsSync(excelFile)) {
  try {
    fs.unlinkSync(excelFile); // delete before writing
    console.log('🧹 Existing Excel file deleted');
  } catch (err) {
    console.error('❌ Failed to delete existing file:', err.message);
    return;
  }
}
  //  Save Excel file to disk
  await workbook.xlsx.writeFile(excelFile);

  // Create password-protected ZIP using OS zip
  const cmd = `zip -P ${password} ${zipFile} ${excelFile}`;
  exec(cmd, async (err, stdout, stderr) => {
    if (err) {
      console.error('❌ Error zipping file:', err);
      return res.status(500).send('Failed to zip');
    }

    console.log(' Password-protected ZIP created:', zipFile);

    //  Send zip as download
    res.setHeader('Content-Disposition', `attachment; filename=${zipFile}`);
    res.setHeader('Content-Type', 'application/zip');
    res.sendFile(path.resolve(zipFile), async () => {
      // Cleanup
      await fsPromise.unlink(excelFile);
      await fsPromise.unlink(zipFile);
    });
  });
});// Helper: add a styled row title
function addSectionTitle(title) {
  const row = sheet.addRow([title]);
  row.font = { bold: true, size: 14 };
  sheet.mergeCells(`A${row.number}:H${row.number}`);
}

// Helper: add a styled header row
function addHeaderRow(headerArray) {
  const row = sheet.addRow(headerArray);
  row.font = { bold: true, size: 12 };
}

// Helper: auto-size columns
function autoSizeColumns() {
  sheet.columns.forEach(col => {
    let max = 10;
    col.eachCell({ includeEmpty: true }, cell => {
      max = Math.max(max, cell.value ? cell.value.toString().length : 0);
    });
    col.width = max + 2;
  });
}

app.get('/protect-excelsheet2', async (req, res) => {

try{
// --- Merchant Info (with label styling) ---
sheet.addRow([]);
[
  ["Merchant Name", data.merchantInfo.name, "", "", "From Date", data.merchantInfo.fromDate],
  ["MID", data.merchantInfo.mid, "", "", "To Date", data.merchantInfo.toDate],
  ["CFD", data.merchantInfo.cfd, "", "", "Generated On", data.merchantInfo.generatedOn],
  ["GSTIN", data.merchantInfo.gstin, "", "", "Support Contact", data.merchantInfo.supportContact],
  ["PAN", data.merchantInfo.pan, "", "", "Support Mail", data.merchantInfo.supportMail],
  ["Address", data.merchantInfo.address, "", "", "Website", data.merchantInfo.website],
].forEach(arr => {
  const row = sheet.addRow(arr);
  row.getCell(1).font = { bold: true }; // left labels
  row.getCell(5).font = { bold: true }; // right labels
});
sheet.addRow([]);

// --- Settlement Summary ---
addSectionTitle("Settlement Summary");
addHeaderRow(["Transaction Date", "Gross", "Fee", "GST", "Net Payable", "Refund", "Chargeback", "Net Settlement"]);
data.settlementSummary.forEach(e => {
  sheet.addRow([
    e.transactionDate,
    `₹${e.gross}`,
    `₹${e.fee}`,
    `₹${e.gst}`,
    `₹${e.netPayable}`,
    `₹${e.refund}`,
    `₹${e.chargeback}`,
    `₹${e.netSettlement}`
  ]);
});
sheet.addRow([]);

// --- POS Summary ---
addSectionTitle("POS Settlement Summary");
addHeaderRow(["Bank", "Txn Count", "VISA", "MasterCard", "RUPAY", "Total Amount", "Net"]);
data.posSummary.forEach(e => {
  sheet.addRow([
    e.bank,
    e.txnCount,
    e.visa,
    e.master,
    e.rupay,
    `₹${e.amount}`,
    `₹${e.net}`
  ]);
});
sheet.addRow([]);

// --- Additional Fees ---
addSectionTitle("Additional Fees");
addHeaderRow(["Txn ID", "Txn Date", "Fee Type", "Debit", "Credit"]);
data.additionalFees.forEach(f => {
  sheet.addRow([
    f.txnId,
    f.date,
    f.feeType,
    `₹${f.debit}`,
    `₹${f.credit}`
  ]);
});

// Auto-size columns for better look
autoSizeColumns();

// Save Excel
workbook.xlsx.writeFile("CredoPay_Report_Styled.xlsx").then(() => {
  console.log("✅ Excel generated with styled headers and bold labels.");
});
// res.setHeader('Content-Disposition', `attachment; filename="${zipname}"`);
//     res.setHeader('Content-Type', 'application/zip');

//     // Send file
//     res.sendFile(path.resolve(zipname))
}catch(err){
  console.log("log===>",err)
}
})


const archiver = require('archiver');

// function zipWithPassword(excelPath, zipPath, res) {
//   const output = fs.createWriteStream(zipPath);
//   const archive = archiver('zip', {
//     zlib: { level: 9 },
//     password: '123' // ⚠ archiver v6+ supports encryption, else needs workaround
//   });

//   output.on('close', () => {
//     res.download(zipPath, () => {
//       fs.unlinkSync(zipPath);
//       fs.unlinkSync(excelPath);
//     });
//   });

//   archive.on('error', err => {
//     throw err;
//   });

//   archive.pipe(output);
//   archive.file(excelPath, { name: 'CredoPay_Report_Styled.xlsx' });
//   archive.finalize();
// }

// app.get('/download-protected-excel', async (req, res) => {
//   const excelFile = 'CredoPay_Report.xlsx';
//   const zipFile = 'CredoPay_Report_Protected.zip';
//   const password = '123';

//   // Step 1: Generate Excel
//   const workbook = new ExcelJS.Workbook();
//   const sheet = workbook.addWorksheet('Report');

//   sheet.addRow(['CredoPay Report']);
//   sheet.getRow(1).font = { size: 14, bold: true };
//   sheet.mergeCells('A1:D1');

//   await workbook.xlsx.writeFile(excelFile);

//   // Step 2: Create password-protected ZIP
//   const zip = new Zip();
//   zip.addFile(excelFile); // Add Excel file
//   await zip.archive(zipFile, { password });

//   // Step 3: Send the ZIP as response
//   res.setHeader('Content-Disposition', `attachment; filename=${zipFile}`);
//   res.setHeader('Content-Type', 'application/zip');
//   res.sendFile(path.resolve(zipFile), (err) => {
//      if (err) {
//       console.error('Error sending file:', err);
//       res.status(500).send('Download failed');
//     }
//     // Step 4: Cleanup
//    fs.unlink(excelFile).catch(e => console.error('Failed to delete Excel:', e));
//     fs.unlink(zipFile).catch(e => console.error('Failed to delete ZIP:', e))
//   });
// });
app.get('/download-protected-excel', async (req, res) => {
  const { add } = require('node-7z');
const sevenBin = require('7zip-bin');

  const excelFile = 'CredoPay_Report.xlsx';
  const zipFile = 'CredoPay_Report_Protected.zip';
  const password = '123';

  try {
    // Step 1: Generate Excel
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Report');

    sheet.addRow(['CredoPay Report']);
    sheet.getRow(1).font = { size: 14, bold: true };
    sheet.mergeCells('A1:D1');

    await workbook.xlsx.writeFile(excelFile);

    // Step 2: Zip with password
    const zip = new Zip();
    zip.addFile(excelFile);
   
const zipPath = path.resolve('CredoPay_Report_Protected.zip');
const inputFile = path.resolve('CredoPay_Report.xlsx');


await new Promise((resolve, reject) => {
  const archiveStream = add(zipPath, [inputFile], {
    $bin: sevenBin.path7za,
    password: '123',
  });

  archiveStream.on('end', () => {
    console.log('✅ Password-protected ZIP created!');
    resolve();
  });

  archiveStream.on('error', (err) => {
    console.error('❌ Error creating ZIP:', err);
    reject(err);
  });
});


    // Step 3: Send file
    res.setHeader('Content-Disposition', `attachment; filename=${zipFile}`);
    res.setHeader('Content-Type', 'application/zip');
    res.sendFile(path.resolve(zipFile), async (err) => {
      if (err) {
        console.error('❌ Send error:', err);
        return;
      }

      // Step 4: Safe cleanup
      try {
        await fsPromise.unlink(excelFile);
      } catch (e) {
        console.error('⚠️ Failed to delete Excel:', e.message);
      }

      try {
        await fsPromise.unlink(zipFile);
      } catch (e) {
        console.error('⚠️ Failed to delete ZIP:', e.message);
      }
    });
  } catch (error) {
    console.error('❌ Something went wrong:', error);
    res.status(500).send('Server Error');
  }
});



app.post('/protecting-pdf', upload.single('file'), async(req, res) => {
 console.log("req.file ===>", req.file);
  console.log("req.body ===>", req.body);
  
  let protectedPdf=  await productedPdf(req.file.buffer,req.body.password)

  res.setHeader('Content-Disposition', `attachment; filename="protected-${req.file.originalname}.pdf"`);
  res.setHeader('Content-Type', 'application/pdf');
  res.send(protectedPdf);

});




