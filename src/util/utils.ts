// var dayjs = require('dayjs');
// var utc = require('dayjs/plugin/utc');
// var timezone = require('dayjs/plugin/timezone');

import dayjs from 'dayjs';
import { join } from 'path';

export type messageType = {
  msg: string;
  user: string;
  _msg?: unknown;
};

export type messageResType = {
  message: { msg: string; user: string; _msg: string };
  timestamp: string;
  level: string;
  source: string;
};

export const constructLog = (
  message: messageType,
  level = 'info',
  timestamp = new Date().toLocaleString(),
  source = 'sikara',
): messageResType => ({
  message: { ...message, _msg: JSON.stringify(message._msg) ?? '' },
  timestamp,
  level: level.toUpperCase(),
  source,
});

export const getShanghaiDate = () => dayjs().tz('Asia/Shanghai');

const _dirname = process.cwd();
export const projectFolder = join(_dirname, 'tmp', 'upload');
