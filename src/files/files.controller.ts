import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilesService } from './files.service';
import { FastifyFileInterceptor } from './files.interceptor';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/file-upload-util';
import { Request } from 'express';
import { AuthMiddleware } from 'src/middleware/auth-middleware.decorator';

@ApiTags('Files')
@Controller({
  path: 'files',
  version: '1',
})
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FastifyFileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadFile(
    @AuthMiddleware() middleware: Request,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // return { image: fileMapper({ file, req }) };
    return await this.filesService.uploadFile(file);
  }

  @Get(':path')
  download(@Param('path') path, @Response() response) {
    return response.sendFile(path, { root: './files' });
  }
}
