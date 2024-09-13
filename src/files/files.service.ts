import { BadGatewayException, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as sharp from 'sharp';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  // ---------- Save File ---------- //

  async saveFile(file: Express.Multer.File) {
    try {
      let newFile = file;
      const imgExtns = ['.jpg', '.jpeg', '.png', 'gif'];
      const extension = path.extname(file.originalname).toLowerCase();
      if (imgExtns.includes(extension)) {
        newFile = await this.updateImage(file);
      }
      const fileName = uuid.v4() + extension;
      const filePath = path.resolve('static');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);

      return fileName;
    } catch (error) {
      throw new BadGatewayException('An error occurred while writing files');
    }
  }

  // ---------- Update image ---------- //

  async updateImage(file: Express.Multer.File) {
    try {
      let buffer = file.buffer;
      const image = sharp(buffer);
      const metadata = await image.metadata();
      let processImage = image.resize({
        width: 320,
        height: 240,
        withoutEnlargement: true,
      });

      if (metadata.format === 'jpg' || metadata.format === 'jpeg') {
        console.log('jpg');
        processImage.jpeg({ quality: 90, chromaSubsampling: '4:4:4' });
      } else if (metadata.format === 'png') {
        processImage.png({ compressionLevel: 9 });
      } else if (metadata.format === 'gif') {
        processImage.gif();
      }

      const outputBuffer = await processImage.toBuffer();
      file.buffer = outputBuffer;
      return file;
    } catch (error) {
      throw new BadGatewayException('An error occurred while converting image');
    }
  }

  // ---------- Read File ---------- //

  readFile(fileName: string) {
    const filePath = path.join('static', fileName);
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      return fileBuffer;
    }
    return null;
  }
}
