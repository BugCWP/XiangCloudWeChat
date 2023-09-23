import {fileUpload, httpRequest} from './http';
import {polyfill} from './utils'
import {authService} from "./authService";
import {configService} from "./configService";

export const helper = {
  httpRequest,
  fileUpload,
  polyfill,
  authService,
  configService
};
