const blindKeys = ["token", "password", "ip", "hostname", "cookie"];
const event = {};
const options = {};

function simple(...args) {
  if (process.env.DEBUG == true) console.log(__logBase__(...args));
}

function debug(...args) {
  if (process.env.DEBUG == true)
    console.log(
      __logBase__(...args, { options: { level: "debug", ...options.meta } })
    );
}

function info(...args) {
  console.log(
    __logBase__(...args, { options: { level: "info", ...options.meta } })
  );
}

function danger(...args) {
  console.trace(
    __logBase__(...args, { options: { level: "danger", ...options.meta } })
  );
}

function error(...args) {
  console.trace(
    __logBase__(...args, { options: { level: "error", ...options.meta } })
  );
}

function __logBase__(...args) {
  return JSON.stringify(__logBaseLP__(...args), null, 2);
}
function __logBaseLP__(...args) {
  return args.map((arg) => {
    if (typeof arg === "object" && arg !== null) {
      const blindArg = {};
      for (let key in arg) {
        if (arg.hasOwnProperty(key)) {
          if (typeof arg[key] === "object" && arg[key] !== null) {
            blindArg[key] = __logBaseLP__(arg[key]);
          } else {
            blindArg[key] = blindKeys.includes(key)
              ? "******** - Blinded by logging system"
              : arg[key];
          }
        }
      }
      return blindArg;
    } else {
      return arg;
    }
  });
}

module.exports = {
  event,
  options,
  debug,
  info,
  danger,
  error,
  simple,
};
