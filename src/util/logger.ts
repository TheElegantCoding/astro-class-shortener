import {
  colorAnsi,
  loggerIcon,
  LogManager,
  loggerStyle
} from 'logginlys';

const logger = new LogManager();

const loggerLoader = (message: string) => {
  const badge = `${colorAnsi.bgBlue} ${loggerIcon.info} INFO ${colorAnsi.reset}`;
  const loaderMessage = loggerStyle.ansi(message, { color: colorAnsi.blue });
  const loaderInstance = logger.loader({
    message: `${badge} ${loaderMessage}`,
    showTimestamp: true
  });

  return loaderInstance;
};

export { logger, loggerLoader };