import errorCode from './errorCode';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path'

const defaultPath = ['public', 'assets', 'images'];

const isImage = (file) => {
  const type = file.type.split("/").pop();
  const validTypes = ["jpg", "jpeg", "png"];
  if (validTypes.indexOf(type) === -1) {
    return false;
  }
  return true;
};

const uploadImage = function(req, res, imagePath) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });
    const uploadFolder = path.join(process.cwd(), ...defaultPath, imagePath);

    form.parse(req, function (err, _fields, files) {
      if (err) {
        res.status(400).json(errorCode.UploadFailed);
        return;
      }

      if (!files.file || Array.isArray(files.file) ) {
        res.status(400).json(errorCode.BadRequest);
        return;
      }

      const file = files.file;
      const baseName = file.path.replace(/.*_/, '');
      const fileExt = file.name.split('.').pop();
      const isValid = isImage(file);

      if (!isValid) {
        res.status(400).json(errorCode.BadRequest);
        return;
      }

      if (!fs.existsSync(uploadFolder)) {
        try {
          fs.mkdirSync(uploadFolder);
        } catch (e) {
          res.status(500).json(errorCode.InternalServerError);
          return;
        }
      }

      let fileName;
      let filePath;
      do {
        fileName = `${baseName + parseInt(Math.random()*10).toString()}.${fileExt}`
        filePath = path.join(uploadFolder, fileName);
      } while (fs.existsSync(filePath));

      try {
        fs.renameSync(file.path, filePath);
      } catch (e) {
        res.status(500).json(errorCode.InternalServerError);
        return;
      }

      res.status(200).json({
        imageUrl: `${path.join(imagePath, fileName)}`
      })
    });
  });
}

export { uploadImage };