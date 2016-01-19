import nconf from "nconf";

const CONFIG_PATH = path.join(getUserHome(), '.ux-global.json');

nconf.file({ file: CONFIG_PATH });


export function get(key) {
    nconf.get(key);
}

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}
