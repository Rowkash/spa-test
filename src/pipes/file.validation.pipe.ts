import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (file) {
      const imgTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const imgExtns = ['.jpg', '.jpeg', '.png', 'gif'];
      const txtType = 'text/plain';

      const fileType = file.mimetype;
      const extension = path.extname(file.originalname).toLowerCase();

      if (imgTypes.includes(fileType)) {
        if (!imgExtns.includes(extension))
          throw new BadRequestException(
            'Invalid file type. Only images (jpg, jpeg, png, etc.) are allowed.',
          );
      } else if (txtType.includes(fileType)) {
        if (extension !== '.txt')
          throw new BadRequestException(
            'Invalid file extension. Expected txt.',
          );

        if (file.size > 100000)
          throw new BadRequestException(
            'Invalid file size. File must be <= 100kb',
          );
      } else {
        throw new BadRequestException('Wrong file exception');
      }
      return file;
    }

    return;
  }
}
