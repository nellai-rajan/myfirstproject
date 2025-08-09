const app=require('../express.js')

const { PDFDocument,StandardFonts,rgb } = require('pdf-lib-plus-encrypt');
const multer = require('multer');

const upload = multer();
// This using API
app.post('/protect-pdf', upload.single('file'), async(req, res) => {
 console.log("req.file ===>", req.file);
  console.log("req.body ===>", req.body);
  const pdfDoc=await PDFDocument.load(req.file.buffer)
  
  let password=req.body.password
 
   await pdfDoc.encrypt({
    userPassword: password,
    // ownerPassword:password,
    // permissions: { printing: false, modifying: false },
  });

  let protectedPdf=  Buffer.from(await pdfDoc.save());

  res.setHeader('Content-Disposition', `attachment; filename="protected-${req.file.originalname}.pdf"`);
  res.setHeader('Content-Type', 'application/pdf');
  res.send(protectedPdf);

});

// This using common function
async function productedPdf(pdfBuffer,password) {

  const pdfDoc=await PDFDocument.load(pdfBuffer)

   await pdfDoc.encrypt({
      userPassword: password
  });

 return Buffer.from(await pdfDoc.save());

}

module.exports={productedPdf}
